import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { writeBatch, doc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../../services/firebase";
import { SEED_COLUMNS } from "../../utils/constants";

const AVATAR_COLORS = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];

const SEED_MEMBERS = [
    { 
        name: "Alice Monroe", 
        avatarColor: AVATAR_COLORS[0] 
    },
    { 
        name: "Ben Carter", 
        avatarColor: AVATAR_COLORS[1] 
    },
    { 
        name: "Clara Singh", 
        avatarColor: AVATAR_COLORS[2] 
    },
    { 
        name: "David Okafor", 
        avatarColor: AVATAR_COLORS[3] 
    },
    { 
        name: "Eva Martínez", 
        avatarColor: AVATAR_COLORS[4] 
    },
];

async function seedBoard(uid) {
    const batch = writeBatch(db);
    const now   = serverTimestamp();

    const memberIds = SEED_MEMBERS.map((m, i) => {
        const id = `member-seed-${i}`;
        batch.set(doc(db, "users", uid, "members", id), { id, ...m, createdAt: now });
        return id;
    });

    SEED_COLUMNS.forEach((colData, colIndex) => {
        const colId = `col-seed-${colIndex}`;
        const taskIds = [];

        colData.tasks.forEach((taskData, taskIndex) => {
            const taskId = `task-seed-${colIndex}-${taskIndex}`;
            taskIds.push(taskId);

            const assignees = [memberIds[taskIndex % memberIds.length]];

            if (taskIndex % 3 === 0) assignees.push(memberIds[(taskIndex + 1) % memberIds.length]);

            batch.set(doc(db, "users", uid, "tasks", taskId), {
                id: taskId,
                columnId: colId,
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                label: taskData.label,
                assignees,
                dueDate: null,
                createdAt: now,
            });
        });

        batch.set(doc(db, "users", uid, "columns", colId), {
            id: colId,
            title: colData.title,
            tasks: taskIds,
            order: colIndex,
            createdAt: now,
        });
    });

    await batch.commit();
}

export const signUp = createAsyncThunk(
    "auth/signUp",
    async ({ email, password, displayName }, { rejectWithValue }) => {
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName });

            await seedBoard(cred.user.uid);

            return {
                uid: cred.user.uid,
                email: cred.user.email,
                displayName: cred.user.displayName,
            };
        }
        catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const signIn = createAsyncThunk(
    "auth/signIn",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);

            return {
                uid: cred.user.uid,
                email: cred.user.email,
                displayName: cred.user.displayName,
            };
        }
        catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const signInWithGoogle = createAsyncThunk(
    "auth/signInWithGoogle",
    async (_, { rejectWithValue }) => {
        try {
            const cred = await signInWithPopup(auth, googleProvider);

            if (cred.user.metadata.creationTime === cred.user.metadata.lastSignInTime) {
                await seedBoard(cred.user.uid);
            }

            return {
                uid: cred.user.uid,
                email: cred.user.email,
                displayName: cred.user.displayName,
            };
        }
        catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const logOut = createAsyncThunk(
    "auth/logOut",
    async (_, { rejectWithValue }) => {
        try {
            await signOut(auth);
        }
        catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        status: "idle",
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = action.payload ? "authenticated" : "unauthenticated";
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        const pending = (state) => { 
            state.status = "loading";
            state.error = null;
        };
        const rejected = (state, action) => { 
            state.status = "unauthenticated";
            state.error = action.payload;
        };

        builder
        .addCase(signUp.pending, pending)
        .addCase(signUp.fulfilled, (state, action) => { 
            state.status = "authenticated"; 
            state.user = action.payload;
        })
        .addCase(signUp.rejected, rejected)

        .addCase(signIn.pending, pending)
        .addCase(signIn.fulfilled, (state, action) => { 
            state.status = "authenticated";
            state.user = action.payload;
        })
        .addCase(signIn.rejected, rejected)

        .addCase(signInWithGoogle.pending, pending)
        .addCase(signInWithGoogle.fulfilled,(state, action) => { 
            state.status = "authenticated";
            state.user = action.payload;
        })
        .addCase(signInWithGoogle.rejected, rejected)

        .addCase(logOut.fulfilled, (state) => { 
            state.status = "unauthenticated";
            state.user = null;
        })
        .addCase(logOut.rejected, rejected);
    },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
