/// Messages that are relayed to all of the clients
export type AppMessage = | ReceiveYoutubeVideoState | CloseIntegration | AssignNewHost;

export interface ReceiveYoutubeVideoState {
    type: "receive-youtube-video-state";
    payload: { state: YT.PlayerState, time: number };
}

/// Internal component messages
export type ComponentMessage = | YoutubeVideoStateChanged | CloseIntegration

export interface CloseIntegration {
    type: "close-integration";
}

export interface AssignNewHost {
    type: "assign-new-host";
}

export interface YoutubeVideoStateChanged {
    type: "youtube-video-state-changed";
    payload: { state: YT.PlayerState, time: number };
}
