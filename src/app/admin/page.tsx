import React from "react";
import { getCurrentUser } from "@/lib/auth/currentUser";

const styles = {
    main: {
        padding: "2rem",
        maxWidth: "700px",
        margin: "2rem auto",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        fontFamily: "Segoe UI, Arial, sans-serif",
    } as React.CSSProperties,
    h1: {
        fontSize: "2.5rem",
        marginBottom: "1.5rem",
        color: "#2d3748",
        letterSpacing: "-1px",
    } as React.CSSProperties,
    section: {
        background: "#f7fafc",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    } as React.CSSProperties,
    h2: {
        fontSize: "1.5rem",
        marginBottom: "0.5rem",
        color: "#4a5568",
    } as React.CSSProperties,
    p: {
        color: "#555",
        fontSize: "1.1rem",
    } as React.CSSProperties,
};

export default async function AdminPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        return (
            <main style={styles.main}>
                <h1 style={styles.h1}>Access Denied</h1>
                <p style={styles.p}>You do not have permission to view this page.</p>
            </main>
        );
    }
    return (
        <main style={styles.main}>
            <h1 style={styles.h1}>Admin Dashboard</h1>
            <section style={styles.section}>
                <h2 style={styles.h2}>Welcome, Admin!</h2>
                <p style={styles.p}>WIP : get this flag : {'CTF{f4k3_4dm1n}'}</p>
            </section>
        </main>
    );
};