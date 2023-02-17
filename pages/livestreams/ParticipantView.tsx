/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  CSSProperties,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Property } from "csstype";
import {
  ConnectionQuality,
  LocalTrack,
  Participant,
  RemoteTrack,
} from "livekit-client";
import { useParticipant } from "@livekit/react-core";

import { AspectRatio } from "react-aspect-ratio";
import { DisplayContext } from "./DisplayContext";
import styles from "./styles.module.css";
import { VideoRenderer, VideoRendererProps } from "./VideoRender";
import classNames from "classnames";

export interface ParticipantProps {
  participant: Participant;
  displayName?: string;
  width?: Property.Width;
  height?: Property.Height;
  className?: string;
  videoClassName?: string;
  aspectWidth?: number;
  aspectHeight?: number;
  orientation?: "landscape" | "portrait";
  showOverlay?: boolean;
  showConnectionQuality?: boolean;
  speakerClassName?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

export const ParticipantView = ({
  participant,
  width,
  height,
  className,
  speakerClassName,
  aspectWidth,
  aspectHeight,
  orientation,
  displayName,
  showOverlay,
  showConnectionQuality,
  videoClassName,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: ParticipantProps) => {
  const { cameraPublication, isLocal, connectionQuality, isSpeaking } =
    useParticipant(participant);
  const [videoSize, setVideoSize] = useState<string>();
  const [currentBitrate, setCurrentBitrate] = useState<number>();
  const context = useContext(DisplayContext);

  const handleResize = useCallback((width: number, height: number) => {
    setVideoSize(`${width}x${height}`);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let total = 0;
      participant.tracks.forEach((pub) => {
        if (
          pub.track instanceof LocalTrack ||
          pub.track instanceof RemoteTrack
        ) {
          total += pub.track.currentBitrate;
        }
      });
      setCurrentBitrate(total);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const containerStyles: CSSProperties = {
    width: width,
    height: height,
  };

  // when aspect matches, cover instead
  let objectFit: Property.ObjectFit = "contain";
  let videoOrientation: "landscape" | "portrait" | undefined;
  if (!orientation && aspectWidth && aspectHeight) {
    orientation = aspectWidth > aspectHeight ? "landscape" : "portrait";
  }
  if (cameraPublication?.dimensions) {
    videoOrientation =
      cameraPublication.dimensions.width > cameraPublication.dimensions.height
        ? "landscape"
        : "portrait";
  }

  if (videoOrientation === orientation) {
    objectFit = "cover";
  }

  if (!displayName) {
    displayName = participant.name || participant.identity;
    if (isLocal) {
      displayName += " (You)";
    }
  }

  let mainElement: ReactElement;
  if (
    cameraPublication?.isSubscribed &&
    cameraPublication?.track &&
    !cameraPublication?.isMuted
  ) {
    mainElement = (
      <VideoRenderer
        track={cameraPublication.track}
        isLocal={isLocal}
        objectFit={objectFit}
        width="100%"
        height="500px"
        className={classNames(videoClassName, styles.video)}
        onSizeChanged={handleResize}
      />
    );
  } else {
    mainElement = <div className={styles.placeholder_container} />;
  }

  const classes = [styles.participant];
  if (className) {
    classes.push(className);
  }
  if (isSpeaking) {
    classes.push(speakerClassName ?? styles.speaker);
  }
  const isAudioMuted = !participant.isMicrophoneEnabled;

  // gather stats
  let statsContent: ReactElement | undefined;
  if (context.showStats) {
    statsContent = (
      <div className={styles.stats}>
        <span>{videoSize}</span>
        {currentBitrate !== undefined && currentBitrate > 0 && (
          <span>&nbsp;{Math.round(currentBitrate / 1024)} kbps</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={classes.join("flex")}
      style={containerStyles}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {aspectWidth && aspectHeight && (
        <AspectRatio ratio={aspectWidth / aspectHeight}>
          {mainElement}
        </AspectRatio>
      )}
      {(!aspectWidth || !aspectHeight) && mainElement}

      {(showOverlay || context.showStats) && (
        <div className={styles.participantBar}>
          <div className={styles.name}>{displayName}</div>
          <div className={styles.center}>{statsContent}</div>
          <div>
            <FontAwesomeIcon
              icon={isAudioMuted ? faMicrophoneSlash : faMicrophone}
              height={24}
              className={isAudioMuted ? styles.iconRed : styles.iconNormal}
            />
          </div>
        </div>
      )}
    </div>
  );
};
