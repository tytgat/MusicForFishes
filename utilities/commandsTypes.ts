
export type CommandReturnType = {
    action: ACTION,
    data?: any
}

export enum ACTION {
    NONE,// data: none
    STOP,// data: none
    ADDTOPLAYLIST// data: string
}