import { faDesktop, faStop } from "@fortawesome/free-solid-svg-icons";
import { Room } from "livekit-client";
import React, { ReactElement } from "react";
import { useParticipant } from "@livekit/react-core";
import { AudioSelectButton } from "./AudioSelectButton";
import { ControlButton } from "./ControlButton";
import styles from "./styles.module.css";
import { VideoSelectButton } from "./VideoSelectButton";
import SvgSharingOn from "../../assets/sharing_on.svg";
import SvgSharingOff from "../../assets/sharing_off.svg";
import SvgLeaveButton from "../../assets/leave.svg";
import Icon from "../../components/Icon/Icon";
import classNames from "classnames";

export interface ControlsProps {
  room: Room;
  enableScreenShare?: boolean;
  enableAudio?: boolean;
  enableVideo?: boolean;
  onLeave?: (room: Room) => void;
  numParticipants?: number;
}

export const ControlsView = ({
  room,
  enableScreenShare,
  enableAudio,
  enableVideo,
  numParticipants,
  onLeave,
}: ControlsProps) => {
  const { cameraPublication: camPub, microphonePublication: micPub } =
    useParticipant(room.localParticipant);

  if (enableScreenShare === undefined) {
    enableScreenShare = true;
  }
  if (enableVideo === undefined) {
    enableVideo = true;
  }
  if (enableAudio === undefined) {
    enableAudio = true;
  }

  const [audioButtonDisabled, setAudioButtonDisabled] = React.useState(false);
  let muteButton: ReactElement | undefined;
  if (enableAudio) {
    const enabled = !(micPub?.isMuted ?? true);
    muteButton = (
      <AudioSelectButton
        isMuted={!enabled}
        isButtonDisabled={audioButtonDisabled}
        onClick={async () => {
          setAudioButtonDisabled(true);
          room.localParticipant
            .setMicrophoneEnabled(!enabled)
            .finally(() => setAudioButtonDisabled(false));
        }}
        onSourceSelected={(device) => {
          setAudioButtonDisabled(true);
          room
            .switchActiveDevice("audioinput", device.deviceId)
            .finally(() => setAudioButtonDisabled(false));
        }}
      />
    );
  }

  const [videoButtonDisabled, setVideoButtonDisabled] = React.useState(false);

  let videoButton: ReactElement | undefined;
  if (enableVideo) {
    const enabled = !(camPub?.isMuted ?? true);
    videoButton = (
      <VideoSelectButton
        isEnabled={enabled}
        isButtonDisabled={videoButtonDisabled}
        onClick={() => {
          setVideoButtonDisabled(true);
          room.localParticipant
            .setCameraEnabled(!enabled)
            .finally(() => setVideoButtonDisabled(false));
        }}
        onSourceSelected={(device) => {
          setVideoButtonDisabled(true);
          room
            .switchActiveDevice("videoinput", device.deviceId)
            .finally(() => setVideoButtonDisabled(false));
        }}
      />
    );
  }

  const [screenButtonDisabled, setScreenButtonDisabled] = React.useState(false);
  let screenButton: ReactElement | undefined;
  if (enableScreenShare) {
    const enabled = room.localParticipant.isScreenShareEnabled;
    screenButton = (
      <ControlButton
        label={enabled ? "Chia sẻ màn hình" : "Chia sẻ màn hình"}
        svg={enabled ? <SvgSharingOn /> : <SvgSharingOff />}
        disabled={screenButtonDisabled}
        onClick={() => {
          setScreenButtonDisabled(true);
          room.localParticipant
            .setScreenShareEnabled(!enabled)
            .finally(() => setScreenButtonDisabled(false));
        }}
      />
    );
  }

return (
    <div className={styles.controlsWrapper}>
      <div className={classNames(styles.participant_wrapper, styles.is_mobile)}>
        <Icon icon="group" size={20} />
        <div className={styles.participantCount}>
          {numParticipants} đang xem
        </div>
      </div>
      <div className={styles.control_button}>
        {muteButton}
        {videoButton}
        {screenButton}
        {onLeave && (
          <ControlButton
            svg={<SvgLeaveButton />}
            label="Kết thúc"
            className={styles.dangerButton}
            onClick={() => onLeave(room)}
          />
        )}
      </div>
    </div>
  );
};
