
import { deleteJobPost } from "@/app/actions"
import { GeneralSubmitButton } from "@/components/common/SubmitButtons"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeftIcon, Trash2Icon } from "lucide-react"

interface DeleteJobDialogProps {
  jobId: string
}

export default function DeleteJobDialog({ jobId }: DeleteJobDialogProps) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Remover Vaga</DialogTitle>
        <DialogDescription className="text-lg text-destructive">
          Você tem certeza absoluta?
        </DialogDescription>
      </DialogHeader>
      <div className="text-sm text-secondary-foreground">
        Esta ação não pode ser desfeita. 
        Isso excluirá permanentemente sua conta e removerá seus dados dos nossos servidores.
      </div>
      <DialogFooter className="sm:justify-start mt-2">
        <DialogClose asChild>
          <div className="flex flex-row gap-4">
            <Button type="button" variant="secondary">
              <ArrowLeftIcon className="size-4" />
              Cancelar
            </Button>
            <form action={async () => {
                "use server"
                await deleteJobPost(jobId)
              }}
            >
              <GeneralSubmitButton text="Remover Vaga"
                variant="destructive"
                icon={<Trash2Icon className="size-4" />}
              />
            </form>
          </div>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
