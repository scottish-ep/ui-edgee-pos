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
import "@livekit/react-components/dist/index.css";
import { ParticipantView, ParticipantProps } from "./ParticipantView";
import styles from "./styles.module.css";
import TableEmpty from "../../components/TableEmpty";
import LoadingComponent from "../../components/Loading/Loading";

const ViewerView = () => {
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    stageLayout: "grid",
  });
  const [token, setToken] = useState("");
  const [livestream, setLivestream] = useState({ name: "" });
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(window.location.search);
  const pathNameArr = window.location.pathname.split("/");
  const id = pathNameArr[pathNameArr.length - 1];

  const url = "wss://live.eastplayers-client.com";

  if ((!url || !token) && !loading) {
    return <div>url and token are required</div>;
  }

  useEffect(() => {
    getTokenGenerate();
    handleAddNumberParticipant();
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", handleRemoveNumberParticipant);

    return () =>
      window.removeEventListener("beforeunload", handleRemoveNumberParticipant);
  }, []);

  const handleAddNumberParticipant = async () => {
    console.log("add");
    await LivestreamApi.addParticipation(id, {
      number: 1,
    });
  };

  const handleRemoveNumberParticipant = async () => {
    console.log("leave");
    await LivestreamApi.addParticipation(id, {
      number: -1,
    });
  };

  const getTokenGenerate = async () => {
    const liveStream = await LivestreamApi.getLivestreamDetail(id, {
      populate: [],
    });
    setLivestream(liveStream);
    const roomName = liveStream.room_id;

    const tokenGenerate = await LivestreamApi.generateTokenForViewer({
      room_name: roomName,
      user: {
        name: "Dat Nguyen Thanh",
        id: "10",
      },
    });
    setToken(tokenGenerate);
    setLoading(false);
  };

  const onLeave = async () => {
    window.location.href = "/";
  };

  async function onConnected(room: Room, query: URLSearchParams) {
    (window as any).currentRoom = room;
  }

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <TableEmpty />
        <div
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <LoadingComponent loading={loading} size={24} color="#FF7A1A" />
        </div>
      </div>
    );
  }

  return (
    <DisplayContext.Provider value={displayOptions}>
      <div id="viewer__livestream_wrap">
        <LiveKitRoom
          url={url}
          token={token}
          participantRenderer={(props: ParticipantProps) => {
            let identity = JSON.parse(props.participant.identity);
            if (identity.is_host) {
              return (
                <ParticipantView
                  {...props}
                  displayName={livestream.name}
                  videoClassName={styles.video_mobile}
                />
              );
            } else {
              return <div />;
            }
          }}
          controlRenderer={(props: any) => {
            return <div />;
          }}
          onConnected={(room) => {
            onConnected(room, query);
          }}
          onLeave={onLeave}
        />
      </div>
    </DisplayContext.Provider>
  );
};

ReactDOM.render(<ViewerView />, document.getElementById("root"));
