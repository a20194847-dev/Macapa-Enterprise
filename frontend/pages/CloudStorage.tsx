import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Cloud, Upload, File, FileText, Image, Folder, HardDrive } from "lucide-react";

const files = [
  { id: 1, name: "Auditoría_Q3_2024.pdf", type: "pdf", size: "2.4 MB", date: "Hace 2 días" },
  { id: 2, name: "Evidencia_Transacciones.xlsx", type: "excel", size: "1.8 MB", date: "Hace 3 días" },
  { id: 3, name: "Captura_Sistema.png", type: "image", size: "856 KB", date: "Hace 5 días" },
  { id: 4, name: "Reporte_Preliminar.docx", type: "doc", size: "945 KB", date: "Hace 1 semana" },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf": return FileText;
    case "excel": return File;
    case "image": return Image;
    case "doc": return FileText;
    default: return File;
  }
};

export default function CloudStorage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Cloud Storage</h1>
          <p className="text-muted-foreground">Almacenamiento seguro para documentos de auditoría</p>
        </div>
        <Button data-testid="button-subir-archivo">
          <Upload className="w-4 h-4 mr-2" />
          Subir Archivo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Espacio Usado</p>
                <p className="text-xl font-bold">6.2 GB / 50 GB</p>
              </div>
            </div>
            <Progress value={12} className="mt-4" />
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <File className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Archivos</p>
                <p className="text-xl font-bold">48</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Folder className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carpetas</p>
                <p className="text-xl font-bold">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Archivos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {files.map((file) => {
              const Icon = getFileIcon(file.type);
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  data-testid={`file-${file.id}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{file.date}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
