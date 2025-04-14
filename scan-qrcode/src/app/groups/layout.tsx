'use client';

import MainLayout from "@/components/MainLayout";

export default function GroupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
} 