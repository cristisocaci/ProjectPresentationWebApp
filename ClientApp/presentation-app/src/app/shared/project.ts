import {Info} from "./info";

export class Project {
    projectId: number;
    title: string;
    photo: string;
    description: string;
    nextProjectId: number;
    userId: string;
    infos: Array<Info>;
}
