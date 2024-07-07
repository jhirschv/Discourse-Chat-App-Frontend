import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserSection from '@/components/UserSection';

const Chat = () => {
  return (
      <Card className="border-0 md:border h-full w-full flex overflow-hidden rounded-none md:rounded-xl">
        <UserSection />
      </Card>
  )
}

export default Chat