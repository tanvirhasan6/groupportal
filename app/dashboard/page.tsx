'use client'

import React, { useState } from "react";

import { DashboardLayout } from "@/components/DashboardLayout";

const Dashboard: React.FC = () => {

    return (
        <DashboardLayout>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Welcome to Zenith Life Dashboard</h2>
                <p className="text-gray-300 leading-relaxed">Manage policies, track claims, and view performance reports here.</p>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
