'use client';

import MainLayout from "@/components/MainLayout";

export default function SessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
} 