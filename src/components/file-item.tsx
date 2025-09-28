
import { Paperclip, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface FileItemProps {
    file: File;
    onRemove: () => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export function FileItem({ file, onRemove }: FileItemProps) {
    return (
        <div className="flex items-center justify-between p-3 rounded-md border bg-muted/50">
            <div className='flex items-center gap-3 overflow-hidden'>
                <Paperclip className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
            </div>
            <Button type="button" onClick={onRemove} variant="ghost" size="icon" className="flex-shrink-0">
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Remove file</span>
            </Button>
        </div>
    );
}
