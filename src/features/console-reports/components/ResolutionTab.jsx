import { useRef, useState } from "react";
import { Star, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/common/EmptyState";

/** Console Report Detail's "Resolution" tab — completion photos, upload, and the citizen's feedback once given. */
export default function ResolutionTab({ report, onUpload }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const resolutionPhotos = report.images?.filter((img) => img.imageType === "RESOLUTION_PHOTO") ?? [];

  async function handleFiles(files) {
    if (!files?.length) return;
    setIsUploading(true);
    try {
      await onUpload(Array.from(files));
      toast.success("Resolution photo uploaded");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Completion photos</h3>
        {resolutionPhotos.length === 0 ? (
          <EmptyState
            title="No completion photos yet"
            description="Upload photo evidence before moving this report to Resolved."
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {resolutionPhotos.map((photo) => (
              <div key={photo.id} className="h-32 w-32 overflow-hidden rounded-md bg-surface-muted">
                <img src={photo.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Button
          variant="outline"
          className="mt-3 gap-2"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-4" />
          {isUploading ? "Uploading…" : "Upload photo"}
        </Button>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Citizen feedback</h3>
        {report.feedback ? (
          <div className="rounded-console border border-console-border p-4">
            <div className="mb-1.5 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "size-4",
                    n <= report.feedback.rating ? "fill-amber-500 text-amber-500" : "text-console-border"
                  )}
                />
              ))}
            </div>
            {report.feedback.comment && <p className="text-sm text-ink-muted">{report.feedback.comment}</p>}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">No feedback from the citizen yet.</p>
        )}
      </div>
    </div>
  );
}
