import React, { useState } from "react";
import { Sidecar, SidecarMarker, mangleSidecarXml } from "./sidecarLoader";
import "./player.css";

const VideoPlayer = () => {
    const [videoSrc, setVideoSrc] = useState<string>("");
    const [steps, setSteps] = useState<number[]>([0, 8, 16]);
    const [startStep, setStartStep] = useState<number>(0);
    const player = React.useRef<HTMLVideoElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        console.log("Loading Video: ", file);
        const videoUrl = URL.createObjectURL(file);

        const sideCarFile = file.path.replace(/\.[^/.]+$/, ".XML");
        fetch(sideCarFile, { mode: 'no-cors' })
            .then((sidecarXml: Response) => {
                sidecarXml.text().then((sideCarXml: string) => {
                    const parsedXml: Sidecar = mangleSidecarXml(sideCarXml);
                    if (!parsedXml?.markers) {
                        return;
                    }
                    setSteps(parsedXml.markers.map((marker: SidecarMarker) => parseFloat(marker.time) || 0));
                    console.log("Parsed Steps: ", steps);
                }
                )
            })
            .then(data => {
                console.log(data);
            });

        setVideoSrc(videoUrl);
    };

    const handleTimeUpdate = (stepIndex: number) => {
        setStartStep(stepIndex);
        if (player?.current) {
            player.current.pause()
            player.current.currentTime = steps[stepIndex]
        }
    }

    const handlePause = () => {
        if (player.current.currentTime >= steps[startStep + 1]) {
            player.current.pause()
            setStartStep(startStep + 1)
        }
    }

    const continuePlay = () => {
        if (player.current) {
            player.current.play()
        }
    }

    return (
        <div className="main">
            <input
                className="select-file"
                type="file"
                onChange={handleFileChange}
                accept=".mov, .mp4"
            />
            <video
                ref={player}
                src={videoSrc}
                width="90%"
                height="60%"
                onTimeUpdate={() => {
                    handlePause()
                }}
            >
            </video>
            <h3>Start Time: {steps[startStep]}</h3>
            <button
                className="continue-button"
                onClick={() => continuePlay()}
            >
                Continue
            </button>
            <div className="steps">
                {steps.map((step, index) => {
                    return (
                        <div key={index}>
                            <button
                                className="step-button"
                                style={
                                    startStep === index
                                        ? { backgroundColor: 'rgb(81, 81, 81)', borderColor: 'rgb(230, 230, 230)', color: 'white' }
                                        : undefined
                                }
                                onClick={() => handleTimeUpdate(index)}
                                value={index}
                            >
                                {step}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
export default VideoPlayer;