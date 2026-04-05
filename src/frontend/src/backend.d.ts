import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TaskInput {
    id?: bigint;
    title: string;
    description: string;
    priority: Priority;
}
export interface Task {
    id: bigint;
    title: string;
    isCompleted: boolean;
    createdAt: Time;
    description: string;
    priority: Priority;
}
export type Time = bigint;
export enum Priority {
    low = "low",
    high = "high",
    medium = "medium"
}
export interface backendInterface {
    createTask(input: TaskInput): Promise<bigint>;
    deleteTask(taskId: bigint): Promise<void>;
    getAllTasks(): Promise<Array<Task>>;
    getTask(taskId: bigint): Promise<Task>;
    toggleTaskCompletion(taskId: bigint): Promise<void>;
    updateTask(input: TaskInput): Promise<void>;
}
