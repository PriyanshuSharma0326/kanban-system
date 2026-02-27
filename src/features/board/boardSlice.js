import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    collection, doc, getDocs, setDoc, updateDoc,
    deleteDoc, writeBatch, serverTimestamp,
} from "firebase/firestore";
import { db } from "../../services/firebase";
const colsRef    = (uid)     => collection(db, "users", uid, "columns");
const colRef     = (uid, id) => doc(db, "users", uid, "columns", id);
const tsksRef    = (uid)     => collection(db, "users", uid, "tasks");
const tskRef     = (uid, id) => doc(db, "users", uid, "tasks", id);
const membersRef = (uid)     => collection(db, "users", uid, "members");
const memberRef  = (uid, id) => doc(db, "users", uid, "members", id);

export const fetchBoard = createAsyncThunk("board/fetchBoard",
    async (uid, { rejectWithValue }) => {
        try {
            const [colSnap, tskSnap, memSnap] = await Promise.all([
                getDocs(colsRef(uid)),
                getDocs(tsksRef(uid)),
                getDocs(membersRef(uid)),
            ]);

            const columns = {};
            colSnap.forEach(d => {
                const { createdAt, updatedAt, ...rest } = d.data();
                columns[d.id] = { tasks: [], ...rest };
            });

            const tasks = {};
            tskSnap.forEach(d => {
                const { createdAt, updatedAt, ...rest } = d.data();
                tasks[d.id] = {
                    description: "",
                    priority: "Low",
                    label: "General",
                    assignees: [],
                    dueDate: null,
                    ...rest,
                };
            });

            const members = {};
            memSnap.forEach(d => {
                const { createdAt, updatedAt, ...rest } = d.data();
                members[d.id] = rest;
            });

            const columnOrder = Object.values(columns)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map(c => c.id);

            return { columns, tasks, columnOrder, members };
        } catch (e) { return rejectWithValue(e.message); }
    }
);

export const addMember = createAsyncThunk("board/addMember",
    async ({ uid, name, avatarColor }, { rejectWithValue }) => {
        try {
            const id     = `member-${Date.now()}`;
            const member = { id, name, avatarColor };
            await setDoc(memberRef(uid, id), { ...member, createdAt: serverTimestamp() });
            return member;
        } catch (e) { return rejectWithValue(e.message); }
    }
);

export const deleteMember = createAsyncThunk("board/deleteMember",
    async ({ uid, memberId }, { rejectWithValue }) => {
        try {
            await deleteDoc(memberRef(uid, memberId));
            return { memberId };
        } catch (e) { return rejectWithValue(e.message); }
    }
);

export const createColumn = createAsyncThunk("board/createColumn",
    async ({ uid, order }, { rejectWithValue }) => {
        try {
            const id  = `col-${Date.now()}`;
            const col = { id, title: "New Column", tasks: [], order };
            await setDoc(colRef(uid, id), { ...col, createdAt: serverTimestamp() });
            return col;
        } catch (e) { return rejectWithValue(e.message); }
    }
);

export const renameColumnThunk = createAsyncThunk("board/renameColumn",
    async ({ uid, columnId, title }, { rejectWithValue }) => {
        try {
            await updateDoc(colRef(uid, columnId), { title });
            return { columnId, title };
        } catch (e) { return rejectWithValue(e.message); }
    }
);

export const deleteColumnThunk = createAsyncThunk("board/deleteColumn",
    async ({ uid, columnId, taskIds }, { rejectWithValue }) => {
        try {
            const batch = writeBatch(db);
            batch.delete(colRef(uid, columnId));
            taskIds.forEach(tid => batch.delete(tskRef(uid, tid)));
            await batch.commit();
            return { columnId, taskIds };
        } catch (e) { return rejectWithValue(e.message); }
    }
);

export const saveColumnOrder = createAsyncThunk("board/saveColumnOrder",
    async ({ uid, columnOrder }, { rejectWithValue }) => {
        try {
            const batch = writeBatch(db);
            columnOrder.forEach((id, i) => batch.update(colRef(uid, id), { order: i }));
            await batch.commit();
            return columnOrder;
        } catch (e) { return rejectWithValue(e.message); }
    }
);

export const createTask = createAsyncThunk("board/createTask",
    async ({ uid, columnId, task }, { getState, rejectWithValue }) => {
        try {
            const col          = getState().board.columns[columnId];
            const updatedTasks = [...(col?.tasks ?? []), task.id];
            await setDoc(tskRef(uid, task.id), { ...task, columnId, createdAt: serverTimestamp() });
            await updateDoc(colRef(uid, columnId), { tasks: updatedTasks });
            return { columnId, task };
        } catch (e) { return rejectWithValue(e.message); }
    }
);

export const updateTaskThunk = createAsyncThunk("board/updateTask",
    async ({ uid, taskId, updates }, { rejectWithValue }) => {
        try {
            await updateDoc(tskRef(uid, taskId), { ...updates, updatedAt: serverTimestamp() });
            return { taskId, updates };
        } catch (e) { return rejectWithValue(e.message); }
    }
);

export const deleteTaskThunk = createAsyncThunk("board/deleteTask",
    async ({ uid, taskId }, { getState, rejectWithValue }) => {
        try {
            const col = Object.values(getState().board.columns)
                .find(c => c.tasks.includes(taskId));
            const batch = writeBatch(db);
            batch.delete(tskRef(uid, taskId));
            if (col) {
                batch.update(colRef(uid, col.id), {
                    tasks: col.tasks.filter(id => id !== taskId),
                });
            }
            await batch.commit();
            return { taskId };
        } catch (e) { return rejectWithValue(e.message); }
    }
);

export const moveTaskThunk = createAsyncThunk("board/moveTask",
    async ({ uid, fromColumn, toColumn, fromTasks, toTasks, taskId }, { rejectWithValue }) => {
        try {
            const batch = writeBatch(db);
            batch.update(colRef(uid, fromColumn), { tasks: fromTasks });
            batch.update(colRef(uid, toColumn),   { tasks: toTasks });
            batch.update(tskRef(uid, taskId),      { columnId: toColumn });
            await batch.commit();
        } catch (e) { return rejectWithValue(e.message); }
    }
);

export const reorderTasksThunk = createAsyncThunk("board/reorderTasks",
    async ({ uid, columnId, items }, { rejectWithValue }) => {
        try {
            await updateDoc(colRef(uid, columnId), { tasks: items });
        } catch (e) { return rejectWithValue(e.message); }
    }
);

const boardSlice = createSlice({
    name: "board",
    initialState: {
        columnOrder:   [],
        columns:       {},
        tasks:         {},
        members:       {},
        activeTaskId:  null,
        panelMode:     null,
        panelColumnId: null,
        status:        "idle",
        error:         null,
    },

    reducers: {
        openTaskPanel: (state, action) => {
            state.activeTaskId  = action.payload;
            state.panelMode     = "edit";
            state.panelColumnId = null;
        },
        openTaskPanelForCreate: (state, action) => {
            state.activeTaskId  = null;
            state.panelMode     = "create";
            state.panelColumnId = action.payload;
        },
        closeTaskPanel: (state) => {
            state.activeTaskId  = null;
            state.panelMode     = null;
            state.panelColumnId = null;
        },
        optimisticMoveTask: (state, action) => {
            const { fromColumn, toColumn, taskId, newIndex } = action.payload;
            state.columns[fromColumn].tasks = state.columns[fromColumn].tasks.filter(id => id !== taskId);
            state.columns[toColumn].tasks.splice(newIndex, 0, taskId);
        },
        optimisticReorderTasks: (state, action) => {
            const { columnId, items } = action.payload;
            state.columns[columnId].tasks = items;
        },
        optimisticReorderColumns: (state, action) => {
            state.columnOrder = action.payload;
        },
        resetBoard: (state) => {
            state.columnOrder   = [];
            state.columns       = {};
            state.tasks         = {};
            state.members       = {};
            state.status        = "idle";
            state.activeTaskId  = null;
            state.panelMode     = null;
            state.panelColumnId = null;
            state.error         = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchBoard.pending,   s => { s.status = "loading"; })
            .addCase(fetchBoard.fulfilled, (s, a) => {
                s.columns     = a.payload.columns;
                s.tasks       = a.payload.tasks;
                s.columnOrder = a.payload.columnOrder;
                s.members     = a.payload.members;
                s.status      = "ready";
            })
            .addCase(fetchBoard.rejected, (s, a) => { s.status = "error"; s.error = a.payload; })
            .addCase(addMember.fulfilled, (s, a) => {
                s.members[a.payload.id] = a.payload;
            })
            .addCase(deleteMember.fulfilled, (s, a) => {
                delete s.members[a.payload.memberId];
                Object.values(s.tasks).forEach(task => {
                    if (task.assignees?.includes(a.payload.memberId)) {
                        task.assignees = task.assignees.filter(id => id !== a.payload.memberId);
                    }
                });
            })
            .addCase(createColumn.fulfilled, (s, a) => {
                s.columns[a.payload.id] = a.payload;
                s.columnOrder.push(a.payload.id);
            })
            .addCase(renameColumnThunk.fulfilled, (s, a) => {
                s.columns[a.payload.columnId].title = a.payload.title;
            })
            .addCase(deleteColumnThunk.fulfilled, (s, a) => {
                const { columnId, taskIds } = a.payload;
                taskIds.forEach(tid => { delete s.tasks[tid]; });
                delete s.columns[columnId];
                s.columnOrder = s.columnOrder.filter(id => id !== columnId);
                if (s.activeTaskId && taskIds.includes(s.activeTaskId)) {
                    s.activeTaskId = null; s.panelMode = null;
                }
                if (s.panelColumnId === columnId) {
                    s.panelMode = null; s.panelColumnId = null;
                }
            })
            .addCase(saveColumnOrder.fulfilled, (s, a) => { s.columnOrder = a.payload; })
            .addCase(createTask.fulfilled, (s, a) => {
                const { columnId, task } = a.payload;
                s.tasks[task.id] = { ...task, columnId };
                if (!s.columns[columnId].tasks.includes(task.id))
                    s.columns[columnId].tasks.push(task.id);
            })
            .addCase(updateTaskThunk.fulfilled, (s, a) => {
                s.tasks[a.payload.taskId] = { ...s.tasks[a.payload.taskId], ...a.payload.updates };
            })
            .addCase(deleteTaskThunk.fulfilled, (s, a) => {
                const col = Object.values(s.columns).find(c => c.tasks.includes(a.payload.taskId));
                if (col) col.tasks = col.tasks.filter(id => id !== a.payload.taskId);
                delete s.tasks[a.payload.taskId];
                if (s.activeTaskId === a.payload.taskId) { s.activeTaskId = null; s.panelMode = null; }
            })
            .addCase(moveTaskThunk.rejected,     (s, a) => { s.error = a.payload; })
            .addCase(reorderTasksThunk.rejected,  (s, a) => { s.error = a.payload; });
    },
});

export const {
    openTaskPanel, openTaskPanelForCreate, closeTaskPanel,
    optimisticMoveTask, optimisticReorderTasks, optimisticReorderColumns,
    resetBoard,
} = boardSlice.actions;

export default boardSlice.reducer;
