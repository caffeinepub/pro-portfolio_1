import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

actor {
  type Task = {
    id : Nat;
    title : Text;
    description : Text;
    priority : Priority;
    isCompleted : Bool;
    createdAt : Time.Time;
  };

  type TaskInput = {
    title : Text;
    description : Text;
    priority : Priority;
    id : ?Nat;
  };

  type Priority = {
    #low;
    #medium;
    #high;
  };

  module Task {
    public func compare(task1 : Task, task2 : Task) : Order.Order {
      Nat.compare(task1.id, task2.id);
    };
  };

  var nextId = 0;
  let tasks = Map.empty<Nat, Task>();

  func getTaskInternal(id : Nat) : Task {
    switch (tasks.get(id)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) { task };
    };
  };

  public shared ({ caller }) func createTask(input : TaskInput) : async Nat {
    let taskId = nextId;
    let newTask : Task = {
      id = taskId;
      title = input.title;
      description = input.description;
      priority = input.priority;
      isCompleted = false;
      createdAt = Time.now();
    };
    tasks.add(taskId, newTask);
    nextId += 1;
    taskId;
  };

  public shared ({ caller }) func updateTask(input : TaskInput) : async () {
    switch (input.id) {
      case (null) { Runtime.trap("Task ID required for update") };
      case (?id) {
        let task = getTaskInternal(id);
        let updatedTask : Task = {
          task with
          title = input.title;
          description = input.description;
          priority = input.priority;
        };
        tasks.add(id, updatedTask);
      };
    };
  };

  public shared ({ caller }) func deleteTask(taskId : Nat) : async () {
    ignore getTaskInternal(taskId);
    tasks.remove(taskId);
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    tasks.values().toArray().sort();
  };

  public query ({ caller }) func getTask(taskId : Nat) : async Task {
    getTaskInternal(taskId);
  };

  public shared ({ caller }) func toggleTaskCompletion(taskId : Nat) : async () {
    let task = getTaskInternal(taskId);
    let updatedTask : Task = {
      task with
      isCompleted = not task.isCompleted;
    };
    tasks.add(taskId, updatedTask);
  };
};
