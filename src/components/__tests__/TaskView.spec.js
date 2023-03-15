import { it, expect, describe, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";

import useTaskStore from "@/stores/taskStore";

import TaskView from "@/views/TaskView.vue";
import TaskItem from "@/components/TaskItem.vue";

describe("TaskView.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it.each([
    [3, 0],
    [0, 3],
    [2, 1]
  ])("Render list of tasks (%i pending, %i done)", (pending, done) => {
    const taskStore = useTaskStore();
    const tasks = [];
    for (let i = 0; i < pending; i++) {
      tasks.push({ done: false });
    }
    for (let i = 0; i < done; i++) {
      tasks.push({ done: true });
    }
    taskStore.tasks = tasks;

    const component = shallowMount(TaskView);

    const taskItems = component.findAllComponents(TaskItem);
    expect(taskItems).toHaveLength(pending + done);
    expect(component.vm.pending_tasks).toHaveLength(pending);
    expect(component.vm.done_tasks).toHaveLength(done);

    taskItems.forEach((wrapper, index) => {
      expect(wrapper.props().task).toStrictEqual(tasks[index]);
    });
  });
});
