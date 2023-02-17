import {
  faSquare,
  faThLarge,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Room,
  RoomEvent,
  setLogLevel,
  VideoPresets,
  createLocalVideoTrack,
  LocalVideoTrack,
} from "livekit-client";
import {
  DisplayContext,
  DisplayOptions,
  LiveKitRoom,
} from "@livekit/react-components";
import "react-aspect-ratio/aspect-ratio.css";
import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import LivestreamApi from "../../services/livestream";
import styles from "./styles.module.css";
import { LivestreamStatusEnum } from "../../enums/enums";
import { ParticipantView, ParticipantProps } from "./ParticipantView";
import { CommentsView } from "./CommentsView";

import { ControlsProps, ControlsView } from "./ControlsView";
import TitlePage from "../../components/TitlePage/Titlepage";
import Icon from "../../components/Icon/Icon";
import { isArray } from "../../utils/utils";
import Socketio from "socket.io-client";
import Echo from "laravel-echo";
import { get } from "lodash";
import { format } from "date-fns/esm";
import Pusher from "pusher-js";
import { VariableSizeList } from "react-window";
import classNames from "classnames";
import moment from "moment";

const StreammerView = () => {
  const [numParticipants, setNumParticipants] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [livestream, setLivestream] = useState({ name: "" });
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    stageLayout: "grid",
  });
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();

  const [messages, setMessages] = useState<any[]>([]);

  const query = new URLSearchParams(window.location.search);
  const pathNameArr = window.location.pathname.split("/");
  const id = pathNameArr[pathNameArr.length - 1];

  const url = "wss://live.eastplayers-client.com";
  const recorder = query.get("recorder");

  if ((!url || !token) && !loading) {
    return <div>url and token are required</div>;
  }

  useEffect(() => {
    getTokenGenerate();
    getData();
  }, []);

  const getData = () => {
    const pusher = new Pusher("e61855e601d10f55da36", {
      cluster: "ap1",
    });
    const channel = pusher.subscribe("participant-livestream");
    channel.bind("App\\Events\\AddParticipant", function (data) {
      console.log("data", data);
      setNumParticipants(data);
    });
  };

  const isMobile = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return false; // tablet
    } else if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return true; // mobile
    }
    return false; // desktop
  };

  const getTokenGenerate = async () => {
    const liveStream = await LivestreamApi.getLivestreamDetail(id, {
      populate: [],
    });
    setLivestream(liveStream);
    const roomName = liveStream.room_id;
    const participant = liveStream.number_participant;

    const tokenGenerate = await LivestreamApi.generateTokenForStreamer({
      room_name: roomName,
      user: {
        name: "Dat Nguyen",
        id: "90",
        is_host: true,
      },
    });

    await LivestreamApi.updateLivestream(id, {
      token_stream: tokenGenerate,
      url_view: `${window.location.origin}/livestream/viewing/${id}`,
    });

    setToken(tokenGenerate);
    setNumParticipants(participant);
    setLoading(false);
  };

  const updateParticipantSize = (room: Room) => {
    console.log("room", room);
    setNumParticipants(room.participants.size + 1);
  };

  const onParticipantDisconnected = (room: Room) => {
    updateParticipantSize(room);

    /* Special rule for recorder */
    if (
      recorder &&
      parseInt(recorder, 10) === 1 &&
      room.participants.size === 0
    ) {
    }
  };

  const updateOptions = (options: DisplayOptions) => {
    setDisplayOptions({
      ...displayOptions,
      ...options,
    });
  };

  const onLeave = async (room: Room) => {
    await LivestreamApi.startLivestream(id, {
      status: LivestreamStatusEnum.COMPLETED,
      ended_at: moment().format(),
    });
    window.location.href = "/livestream/app";
  };

  async function onConnected(room: Room, query: URLSearchParams) {
    // make it easier to debug
    (window as any).currentRoom = room;

    const audioDeviceId = query.get("audioDeviceId");
    if (audioDeviceId && room.options.audioCaptureDefaults) {
      room.options.audioCaptureDefaults.deviceId = audioDeviceId;
    }
    await room.localParticipant.setMicrophoneEnabled(true);

    const videoDeviceId = videoTrack && (await videoTrack.getDeviceId());
    if (videoDeviceId && room.options.videoCaptureDefaults) {
      room.options.videoCaptureDefaults.deviceId = videoDeviceId;
    }
    await room.localParticipant.setCameraEnabled(true);
  }

  if (loading) {
    return <div>Loding</div>;
  }

  return (
    <div className="relative">
      <div className="flex justify-between gap-[30px] sm:py-[32px] sm:px-[28px]">
        <DisplayContext.Provider value={displayOptions}>
          <div className={styles.roomContainer}>
            <div className={styles.topBar}>
              <TitlePage
                href="/livestream/app"
                titleClassName={styles.title_page}
                title="BHV Livestream"
              />
              <div className={styles.participant_wrapper}>
                <Icon icon="group" size={20} />
                <div className={styles.participantCount}>
                  {numParticipants} đang xem
                </div>
              </div>
            </div>
            <LiveKitRoom
              url={url}
              token={token}
              onConnected={(room) => {
                onConnected(room, query);
                room.on(RoomEvent.ParticipantConnected, () => {
                  console.log("check", 1);
                  updateParticipantSize(room);
                });
                room.on(RoomEvent.ParticipantDisconnected, () =>
                  onParticipantDisconnected(room)
                );
                console.log("room", room);
              }}
              participantRenderer={(props: ParticipantProps) => {
                let identity = JSON.parse(props.participant.identity);
                if (identity.is_host) {
                  return (
                    <ParticipantView
                      {...props}
                      displayName={livestream.name}
                      videoClassName={styles.video_desktop}
                      className=" video-area"
                    />
                  );
                } else {
                  return <div></div>;
                }
              }}
              roomOptions={{
                adaptiveStream: true,
                // dynacast: isSet(query, "dynacast"),
                videoCaptureDefaults: {
                  resolution: VideoPresets.h720.resolution,
                },
              }}
              controlRenderer={(props: ControlsProps) => (
                <div className="flex justify-center items-center gap-[18px] sm:justify-center sm:p-[18px] px-[18px] py-[10px]">
                  <ControlsView
                    numParticipants={numParticipants}
                    {...props}
                    onLeave={onLeave}
                  />
                </div>
              )}
            />
          </div>
        </DisplayContext.Provider>
        {!isMobile() && (
          <CommentsView
            livestream_id={id}
            is_mobile={isMobile()}
          ></CommentsView>
        )}
        {isMobile() && (
          <CommentsView
            livestream_id={id}
            is_mobile={isMobile()}
          ></CommentsView>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<StreammerView />, document.getElementById("root"));
