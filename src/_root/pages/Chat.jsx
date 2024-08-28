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
import ChatSection from '@/components/ChatSection';

const Chat = () => {
  return (
      <Card className="border-0 md:border h-full w-full flex overflow-hidden rounded-none md:rounded-xl">
        <UserSection />
        <ChatSection />
      </Card>
  )
}

export default Chat