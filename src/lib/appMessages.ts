/// Messages that are relayed to all of the clients
export type AppMessage = | ReceiveYoutubeVideoState | CloseIntegration | AssignNewHost | RequestYoutubeVideoState

export interface ReceiveYoutubeVideoState {
    type: "receive-youtube-video-state";
    payload: { state: YT.PlayerState, time: number };
}

export interface AssignNewHost {
    type: "assign-new-host";
}

/// Internal component messages
export type ComponentMessage = | YoutubeVideoStateChanged | CloseIntegration | RequestYoutubeVideoState

export interface CloseIntegration {
    type: "close-integration";
}

export interface YoutubeVideoStateChanged {
    type: "youtube-video-state-changed";
    payload: { state: YT.PlayerState, time: number };
}

export interface RequestYoutubeVideoState {
    type: "request-youtube-video-state";
}