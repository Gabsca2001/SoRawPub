'use client';
import { PageLayout } from "@/components/layouts/PageLayout"
import PrenotaForm from "@/components/PrenotaForm";

export default function PrenotaPage() {
  return (
    <PageLayout>
    <main>
      <PrenotaForm />
    </main>
    </PageLayout>
  );
}