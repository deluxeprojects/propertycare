"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Square,
  MoveUpRight,
  Type,
  Undo2,
  Trash2,
  Loader2,
} from "lucide-react";

type Tool = "draw" | "rect" | "arrow" | "text";

interface DrawAction {
  type: Tool;
  color: string;
  strokeWidth: number;
  points?: { x: number; y: number }[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  text?: string;
}

interface ScreenshotAnnotatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  screenshotUrl: string;
  onSave: (dataUrl: string) => void;
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#000000"];

export function ScreenshotAnnotator({
  open,
  onOpenChange,
  screenshotUrl,
  onSave,
}: ScreenshotAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [tool, setTool] = useState<Tool>("draw");
  const [color, setColor] = useState("#ef4444");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [actions, setActions] = useState<DrawAction[]>([]);
  const [currentAction, setCurrentAction] = useState<DrawAction | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load image
  useEffect(() => {
    if (!open) return;
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
    };
    img.src = screenshotUrl;
  }, [open, screenshotUrl]);

  // Render canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    const allActions = currentAction
      ? [...actions, currentAction]
      : actions;

    for (const action of allActions) {
      ctx.strokeStyle = action.color;
      ctx.fillStyle = action.color;
      ctx.lineWidth = action.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (action.type === "draw" && action.points && action.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(action.points[0]!.x, action.points[0]!.y);
        for (let i = 1; i < action.points.length; i++) {
          ctx.lineTo(action.points[i]!.x, action.points[i]!.y);
        }
        ctx.stroke();
      } else if (action.type === "rect" && action.start && action.end) {
        ctx.strokeRect(
          action.start.x,
          action.start.y,
          action.end.x - action.start.x,
          action.end.y - action.start.y
        );
      } else if (action.type === "arrow" && action.start && action.end) {
        const dx = action.end.x - action.start.x;
        const dy = action.end.y - action.start.y;
        const angle = Math.atan2(dy, dx);
        const headLen = 15;

        ctx.beginPath();
        ctx.moveTo(action.start.x, action.start.y);
        ctx.lineTo(action.end.x, action.end.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(action.end.x, action.end.y);
        ctx.lineTo(
          action.end.x - headLen * Math.cos(angle - Math.PI / 6),
          action.end.y - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(action.end.x, action.end.y);
        ctx.lineTo(
          action.end.x - headLen * Math.cos(angle + Math.PI / 6),
          action.end.y - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      } else if (action.type === "text" && action.start && action.text) {
        ctx.font = `${action.strokeWidth * 6}px sans-serif`;
        ctx.fillText(action.text, action.start.x, action.start.y);
      }
    }
  }, [actions, currentAction]);

  useEffect(() => {
    if (imageLoaded) render();
  }, [imageLoaded, render]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasCoords(e);
    setIsDrawing(true);

    if (tool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        const action: DrawAction = {
          type: "text",
          color,
          strokeWidth,
          start: pos,
          text,
        };
        setActions((prev) => [...prev, action]);
        render();
      }
      setIsDrawing(false);
      return;
    }

    const newAction: DrawAction = {
      type: tool,
      color,
      strokeWidth,
      ...(tool === "draw"
        ? { points: [pos] }
        : { start: pos, end: pos }),
    };
    setCurrentAction(newAction);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAction) return;
    const pos = getCanvasCoords(e);

    if (tool === "draw") {
      setCurrentAction({
        ...currentAction,
        points: [...(currentAction.points || []), pos],
      });
    } else {
      setCurrentAction({ ...currentAction, end: pos });
    }
    render();
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentAction) return;
    setIsDrawing(false);
    setActions((prev) => [...prev, currentAction]);
    setCurrentAction(null);
    render();
  };

  const undo = () => {
    setActions((prev) => prev.slice(0, -1));
  };

  const clearAll = () => {
    setActions([]);
  };

  // Render after actions change
  useEffect(() => {
    render();
  }, [actions, render]);

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaving(true);
    try {
      render(); // Final render
      const dataUrl = canvas.toDataURL("image/png");
      onSave(dataUrl);
    } finally {
      setSaving(false);
    }
  };

  const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
    { id: "draw", icon: Pencil, label: "Draw" },
    { id: "rect", icon: Square, label: "Rectangle" },
    { id: "arrow", icon: MoveUpRight, label: "Arrow" },
    { id: "text", icon: Type, label: "Text" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Annotate Screenshot</DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b pb-3">
          {tools.map((t) => (
            <Button
              key={t.id}
              variant={tool === t.id ? "default" : "outline"}
              size="sm"
              onClick={() => setTool(t.id)}
              title={t.label}
            >
              <t.icon className="h-4 w-4" />
            </Button>
          ))}

          <div className="w-px h-6 bg-border mx-1" />

          {COLORS.map((c) => (
            <button
              key={c}
              className={`h-6 w-6 rounded-full border-2 ${color === c ? "border-foreground" : "border-transparent"}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}

          <div className="w-px h-6 bg-border mx-1" />

          <select
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="h-8 rounded border px-2 text-sm"
          >
            <option value={2}>Thin</option>
            <option value={3}>Medium</option>
            <option value={5}>Thick</option>
          </select>

          <div className="w-px h-6 bg-border mx-1" />

          <Button variant="ghost" size="sm" onClick={undo} disabled={actions.length === 0}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll} disabled={actions.length === 0}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto min-h-0">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="max-w-full cursor-crosshair border rounded"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin me-2" />
            ) : null}
            Save Annotation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
