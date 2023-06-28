import React, { useState, useRef, useEffect, MouseEvent, ChangeEvent } from 'react';
import {ws} from "../ws"
import { useParams } from "react-router-dom";
import { ICanvas } from '../types/canvas';
export const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {roomId} = useParams()
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [color, setColor] = useState<string>('#1890ff');
    const [brushSize, setBrushSize] = useState<number>(1);
    const [drawingData, setDrawingData] = useState<ICanvas[]>([])

    const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
        const context = canvasRef.current!.getContext('2d')!
        const { offsetX, offsetY } = event.nativeEvent
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        setDrawingData([...drawingData, {
            offsetX,
            offsetY,
            color,
            brushSize
        }])
    };

    const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        const context = canvasRef.current!.getContext('2d')!
        if (!isDrawing) return;
        const { offsetX, offsetY } = event.nativeEvent
        context.lineTo(offsetX, offsetY);
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        context.stroke();
        setDrawingData([...drawingData, {
            offsetX,
            offsetY,
            color,
            brushSize
        }])
    };

    const handleMouseUp = () => {
        const context = canvasRef.current!.getContext('2d')!
        context.closePath();
        setIsDrawing(false);
        ws.emit("send-drawData", roomId, JSON.stringify(drawingData))
        setDrawingData([])
    };
    const handleDownload = () => {
        const canvas = canvasRef.current
        const image = canvas!.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = image
        link.download = 'WangYu-RTC.png'
        link.click();        
    }
    const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
    }

    const handleBrushSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setBrushSize(parseInt(event.target.value));
    }
    useEffect(() => {
        const context = canvasRef.current!.getContext('2d')!
        ws.on("add-drawData", (data: string) => {
            const arr = JSON.parse(data)
            const {offsetX, offsetY} = arr[0]
            context.beginPath();
            context.moveTo(offsetX, offsetY);
            arr.forEach(({
                offsetX,
                offsetY,
                color,
                brushSize
            }: ICanvas) => {
                context.lineTo(offsetX, offsetY);
                context.strokeStyle = color;
                context.lineWidth = brushSize;
                context.stroke();
            })
            context.closePath();
        })
    }, [])

  return (
    <div>
        <canvas
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={canvasRef}
            width={500}
            height={400} 
            style={{ border: '2px solid #e5e7eb'}}
        />
        <div className="flex mt-2 justify-around">
            <div>
              <label htmlFor="color" className="font-bold">Color</label>
              <input 
                className="ml-3"
                type="color" 
                id="color" 
                value={color} 
                onChange={handleColorChange} 
            />
            </div>
            <div>
                <label htmlFor="brushSize" className="font-bold">Size</label>
                {/* <InputNumber size="small" value={brushSize} onChange={handleBrushSizeChange}/> */}
                <input
                    className="ml-3 border-slate-100 border-2 w-8 border-solid"
                    type="number"
                    id="brushSize"
                    min={1}
                    max={12}
                    value={brushSize}
                    onChange={handleBrushSizeChange}
                />
            </div>
            <div onClick={handleDownload}>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    className="h-6 w-6 " 
                >
                    <path d="M13 10H18L12 16L6 10H11V3H13V10ZM4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19Z"></path>
                </svg>
            </div>
        </div>
    </div>
  );
}