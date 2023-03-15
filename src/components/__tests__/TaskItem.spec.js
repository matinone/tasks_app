import { it, expect, describe, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import useTaskStore from "@/stores/taskStore";

import TaskItem from "@/components/TaskItem.vue";
import EditTaskForm from "@/components/EditTaskForm.vue";

const createTaskItemComponent = () => {
  const task = {
    title: "Task Title",
    description: "Task Description",
    done: false
  };

  const component = shallowMount(TaskItem, {
    props: { task },
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            tasks: { tasks: [task] }
          }
        })
      ]
    }
  });

  return { task, component };
};

describe("TaskItem.vue", () => {
  it("Render single task", async () => {
    const { component } = createTaskItemComponent();

    expect(component.text()).toContain("Task Title");
    expect(component.text()).toContain("Task Description");
    expect(component.text()).toContain("Mark as DONE");

    expect(component.vm.showDropdown).toBe(false);
    expect(component.vm.showEdit).toBe(false);

    const editForm = component.findAllComponents(EditTaskForm);
    expect(editForm).toHaveLength(0);
  });

  it("Mark task as done", async () => {
    const { task, component } = createTaskItemComponent();

    const taskStore = useTaskStore();
    taskStore.resolveTask = vi.fn((task) => {
      task.done = true;
    });

    // click "Mark as DONE" button
    let buttons = component.findAll("button");
    await buttons[1].trigger("click");
    expect(taskStore.resolveTask).toHaveBeenCalledWith(task);
    expect(component.text()).not.toContain("Mark as DONE");
  });
});
