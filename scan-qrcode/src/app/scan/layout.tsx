'use client';

import MainLayout from "@/components/MainLayout";

export default function ScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
} 