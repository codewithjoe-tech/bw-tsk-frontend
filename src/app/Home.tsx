import React, { useState } from "react"
import { Calendar } from "../components/ui/calendar"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table"
import { Button } from "../components/ui/button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../axios"
import { format } from "date-fns"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Spinner } from "../components/ui/Spinner"
import { Check } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"

interface Task {
  id: string
  title: string
  description: string
  date: string
  user: string
  completed: boolean
  created_at: string
  updated_at: string
}

const TaskTable: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const queryClient = useQueryClient()
  const formattedDate = date ? format(date, "yyyy-MM-dd") : ""

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", formattedDate],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/tasks/tasks?date=${formattedDate}`)
      return res.data as Task[]
    },
    enabled: !!formattedDate,
  })

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/api/tasks/task/${id}`)
      return id
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", formattedDate] })
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", formattedDate])
      queryClient.setQueryData<Task[]>(["tasks", formattedDate], (old) =>
        old?.filter((task) => task.id !== id) || []
      )
      toast.success("Task deleted successfully",{
        description : "Your task has been deleted successfully"
      })
      return { previousTasks }
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["tasks", formattedDate], context?.previousTasks)
      toast.error("Failed to delete task")
    },

  })

  const upsertTaskMutation = useMutation({
    mutationFn: async (task: { title: string; description: string; id?: string }) => {
      if (editingTask?.id) {
        const res = await axiosInstance.put(`/api/tasks/task/${editingTask.id}`, {
          title: task.title,
          description: task.description,
          date: formattedDate,
        })
        return res.data as Task
      } else {
        const res = await axiosInstance.post(`/api/tasks/tasks`, {
          title: task.title,
          description: task.description,
          date: formattedDate,
        })
        return res.data as Task
      }
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", formattedDate] })
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", formattedDate])
      let tempId = ''
      if (editingTask?.id) {
        queryClient.setQueryData<Task[]>(["tasks", formattedDate], (old) =>
          old?.map((task) =>
            task.id === editingTask.id
              ? { ...task, title: newTask.title, description: newTask.description }
              : task
          )
        )
      } else {
        tempId = `temp-${Date.now()}`
        queryClient.setQueryData<Task[]>(["tasks", formattedDate], (old) => [
          {
            id: tempId,
            title: newTask.title,
            description: newTask.description,
            date: formattedDate,
            user: "",
            created_at: "",
            updated_at: "",
            completed: false,
          },
          ...(old || []),
        ])
      }
      toast.success(`Task ${editingTask ? "updated" : "added"} successfully`,{
        description : `Your task has been ${editingTask ? "updated" : "added"} successfully`
      })
      setIsDialogOpen(false)
      setTitle("")
      setDescription("")
      setEditingTask(null)
      return { previousTasks, tempId }
    },
    onError: (_err, _newTask, context) => {
      queryClient.setQueryData(["tasks", formattedDate], context?.previousTasks)
      toast.error("Failed to save task")
    },
    onSuccess: (data, _vars, context: any) => {
      queryClient.setQueryData<Task[]>(["tasks", formattedDate], (old) => {
        if (!old) return [data]
        if (editingTask?.id) {
          return old.map((task) => task.id === editingTask.id ? data : task)
        }
        return old.map((task) =>
          task.id === context?.tempId ? data : task
        )
      })
    }
  })

  const toggleCompleteMutation = useMutation({
    mutationFn: async (task: Task) => {
      const res = await axiosInstance.put(`/api/tasks/task/${task.id}`, {
        ...task,
        completed: !task.completed,
      })
      return res.data as Task
    },
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", formattedDate] })
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", formattedDate])
      queryClient.setQueryData<Task[]>(["tasks", formattedDate], (old) =>
        old?.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      )
      return { previousTasks }
    },
    onError: (_err, _task, context) => {
      queryClient.setQueryData(["tasks", formattedDate], context?.previousTasks)
      toast.error("Failed to update completion status")
    },
       onSuccess: (data, _vars, context: any) => {
      queryClient.setQueryData<Task[]>(["tasks", formattedDate], (old) => {
        if (!old) return [data]
        if (editingTask?.id) {
          return old.map((task) => task.id === editingTask.id ? data : task)
        }
        return old.map((task) =>
          task.id === context?.tempId ? data : task
        )
      })
    }
  })

  const handleDelete = (id: string) => deleteTaskMutation.mutate(id)
  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setTitle(task.title)
    setDescription(task.description)
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description required")
      return
    }
    upsertTaskMutation.mutate({ title, description, id: editingTask?.id })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Task Calendar</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your tasks by date</p>
        </div>

        <div className="rounded-lg p-6 shadow-sm flex flex-col justify-center items-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="bg-white rounded-md border border-gray-200 text-lg [&_.rdp]:text-base [&_.rdp-day]:h-12 [&_.rdp-day]:w-12 [&_.rdp-day]:text-lg [&_.rdp-day_selected]:bg-blue-500 [&_.rdp-day_selected]:text-white [&_.rdp-day:hover]:bg-blue-100 [&_.rdp-day:focus]:outline-none [&_.rdp-day:focus]:ring-2 [&_.rdp-day:focus]:ring-blue-500"
          />
          {date && (
            <p className="mt-4 text-center text-sm text-gray-600">
              Selected: <strong>{format(date, "MMMM d, yyyy")}</strong>
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Tasks for {date ? format(date, "MMMM d, yyyy") : "Selected Date"}
            </h2>
            <Dialog open={isDialogOpen} onOpenChange={(value) => {
              if (!value) {
                setTitle("")
                setDescription("")
                setEditingTask(null)
              }
              setIsDialogOpen(value)
            }}>
              <DialogTrigger asChild>
                <Button >Add Task</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    {editingTask ? "Edit Task" : "New Task"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setIsDialogOpen(false)
                      setTitle("")
                      setDescription("")
                      setEditingTask(null)
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!title.trim() || !description.trim()} >
                      {editingTask ? "Update" : "Add"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      <Spinner className="mx-auto h-6 w-6" />
                    </TableCell>
                  </TableRow>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-gray-50">
                      <TableCell className={task.completed ? "line-through text-gray-400" : ""}>{task.title}</TableCell>
                      <TableCell className={task.completed ? "line-through text-gray-400" : ""}>{task.description}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCompleteMutation.mutate(task)}
                          className={`hover:bg-green-50 ${task.completed ? "text-green-600" : "text-gray-400"}`}
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(task)}
                          className="hover:bg-blue-50"
                        >
                          Edit
                        </Button>
                        <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive" size="sm" className="">
      Delete
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete this task.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => handleDelete(task.id)}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      No tasks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskTable
