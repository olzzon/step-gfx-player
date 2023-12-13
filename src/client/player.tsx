import React, { useState } from "react";
import { Sidecar, SidecarMarker, mangleSidecarXml } from "./sidecarLoader";
import "./player.css";

const VideoPlayer = () => {
    const [videoSrc, setVideoSrc] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [steps, setSteps] = useState<number[]>([]);
    const [startStep, setStartStep] = useState<number>(0);
    const player = React.useRef<HTMLVideoElement>(null);
    let pauseTimer: NodeJS.Timeout

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        setStartStep(0);
        setSteps([]);

        console.log("Loading Video: ", file);
        const videoUrl = URL.createObjectURL(file);
        setFileName(file.name);

        const sideCarFile = file.path.replace(/\.[^/.]+$/, ".XML");
        const fetched = await fetch(sideCarFile, { mode: 'no-cors' })
        const sideCarXml = await fetched.text()
        const parsedXml: Sidecar = mangleSidecarXml(sideCarXml);

        if (!parsedXml?.markers) {
            return;
        }
        setSteps(parsedXml.markers.map((marker: SidecarMarker) => parseFloat(marker.time) || 0));
        console.log("Parsed Steps: ", steps);
        setVideoSrc(videoUrl);
    };

    const handleTimeUpdate = (stepIndex: number) => {
        setStartStep(stepIndex);
        if (player?.current) {
            clearInterval(pauseTimer)
            player.current.pause()
            player.current.currentTime = steps[stepIndex]
        }
    }

    const handlePauseAtNextStep = () => {
        if (player.current.currentTime >= steps[startStep + 1]) {
            clearInterval(pauseTimer)
            player.current.pause()
            player.current.currentTime = steps[startStep + 1]
            setStartStep(startStep + 1)
        }
    }

    const continuePlay = () => {
        if (player.current) {
            if (player.current.currentTime > steps[startStep]) {
                player.current.currentTime = steps[startStep + 1]
                setStartStep(startStep + 1)
            } else {
                player.current.currentTime = steps[startStep]
            }
            player.current.play()
            clearInterval(pauseTimer)
            pauseTimer = setInterval(() => handlePauseAtNextStep(), 5)
        }
    }

    const handleCopyToClipboard = () => {
        let text = fileName ? fileName.split('.').slice(0, -1).join('.') : "no file loaded";
        navigator.clipboard.writeText(text)
    }

    const StepButton = (props: { index: number }) => {
        return (
            <button
                className="step-button"
                style={
                    startStep === props.index
                        ? { backgroundColor: 'rgb(81, 81, 81)', 
                            borderColor: 'rgb(230, 230, 230)', 
                            color: 'white' 
                        }
                        : undefined
                }
                onClick={() => handleTimeUpdate(props.index)}
                value={props.index}
            >
                {steps[props.index]}
            </button>
        )
    }

    return (
        <div className="main">
            <div className="file-handling">
                <input
                    className="select-file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".mp4, .webm"
                />
                <button
                    className="copy-button"
                    onClick={() => handleCopyToClipboard()}
                >
                    Filename to Clipboard
                </button>
            </div>
            <video
                className="video-player"
                ref={player}
                src={videoSrc}
                controls
            >
            </video>
            <button
                className="continue-button"
                onClick={() => continuePlay()}
            >
                Continue
            </button>
            <div className="steps">
                {steps.map((step, index) =>
                    <StepButton index={index} />
                )}
            </div>
        </div>
    );
}
export default VideoPlayer;