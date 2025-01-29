import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

import { auth } from "@/app/utils/auth"

const upload = createUploadthing()

// FileRouter para seu aplicativo, pode conter múltiplos FileRoutes.
export const appFileRouter = {
  imageUploader: upload({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  }).middleware(async () => { // Define quantas FileRoutes forem necessárias, cada uma com routeSlug único.
    // Este código é executado no seu servidor antes do upload.
    const session = await auth()

    // Lança uma exceção caso o usuário não esteja autenticado, fazendo com que ele não possa fazer o upload.
    if (!session?.user) throw new UploadThingError("Unauthorized")

    // Qualquer valor retornado aqui estará acessível em onUploadComplete como 'metadata'.
    return { userId: session.user.id }
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete for userId:", metadata.userId)
    console.log("file url", file.url)

    // Qualquer valor retornado aqui é enviado para a callback do lado do cliente 'onClientUploadComplete'.
    return { uploadedBy: metadata.userId }
  }),

  resumeUploader: upload({
    "application/pdf": {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  }).middleware(async () => { // Define permissões e tipos de arquivo para essa FileRoute.
    // Este código é executado no seu servidor antes do upload.
    const session = await auth()

    // Lança uma exceção caso o usuário não esteja autenticado, fazendo com que ele não possa fazer o upload.
    if (!session?.user) throw new UploadThingError("Unauthorized")

      // Qualquer valor retornado aqui estará acessível em onUploadComplete como 'metadata'.
      return { userId: session.user.id }
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete for userId:", metadata.userId)
    console.log("file url", file.url)

    // Qualquer valor retornado aqui é enviado para a callback do lado do cliente 'onClientUploadComplete'.
    return { uploadedBy: metadata.userId }
  }),
} satisfies FileRouter

export type AppFileRouter = typeof appFileRouter;
