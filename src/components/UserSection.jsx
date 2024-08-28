import React, {useState} from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent,PopoverTrigger,} from "@/components/ui/popover"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faEllipsis} from "@fortawesome/free-solid-svg-icons";
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button';

const UserSection = () => {

  const [users, setUsers] = useState([
    { id: 1, username: "JohnDoe", profile_picture: "https://example.com/johndoe.png" },
    { id: 2, username: "JaneSmith", profile_picture: "https://example.com/janesmith.png" },
    { id: 3, username: "ChrisNolan", profile_picture: null },
    { id: 4, username: "AliceJohnson", profile_picture: "https://example.com/alicejohnson.png" },
    { id: 5, username: "BobBrown", profile_picture: null },
  ]);

  const [user] = useState({ user_id: 1 });
  
  const [filteredAndSortedSessions, setFilteredAndSortedSessions] = useState([
    {
      id: 1,
      participants: [
        { id: 1, username: "CurrentUser", profile_picture: null },
        { id: 2, username: "JohnDoe", profile_picture: "https://example.com/johndoe.png" }
      ],
      last_message: {
        sender: "JohnDoe",
        message: "Hey, are you coming to the meeting?",
        timestamp: new Date().toISOString(),
        read: false,
      },
    },
    {
      id: 2,
      participants: [
        { id: 1, username: "CurrentUser", profile_picture: null },
        { id: 3, username: "JaneSmith", profile_picture: "https://example.com/janesmith.png" }
      ],
      last_message: {
        sender: "CurrentUser",
        message: "Sure, I’ll be there in 10 minutes.",
        timestamp: new Date().toISOString(),
        read: true,
      },
    },
    {
      id: 3,
      participants: [
        { id: 1, username: "CurrentUser", profile_picture: null },
        { id: 4, username: "ChrisNolan", profile_picture: null }
      ],
      last_message: {
        sender: "ChrisNolan",
        message: "Check out the new design I uploaded.",
        timestamp: new Date().toISOString(),
        read: false,
      },
    },
  ]);

  const handleUserClick = (participant) => {
    console.log("Clicked on:", participant);
  };

  const compactTimeFormat = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const selectedChat = 'cat'

  return (
    <Card className={`border-none flex-none rounded-none w-1/3 ${selectedChat ? 'hidden lg:block md:w-1/3' : 'w-full lg:w-1/3'}`}> 
        <div className="flex justify-between items-center p-6 pb-2">
            <h1 className="text-2xl font-semibold">Chats</h1>
            <Popover /* open={isPopoverOpen} onOpenChange={setIsPopoverOpen} */>
              <PopoverTrigger><FontAwesomeIcon size="lg" icon={faPenToSquare} /></PopoverTrigger>
              <PopoverContent>
                <div className="relative py-2 w-full flex justify-center items-center">
                    <Search className="absolute left-4 top-5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search Users" className="pl-8 w-full mx-2" /* onChange={e => setSearchTerm(e.target.value)} *//>
                </div>
                <div className="overflow-y-scroll max-h-[250px] scrollbar-custom">
                        <div className="pr-2">
                            {users.map(filteredUser => (
                                  <div key={filteredUser.id} /* onClick={() => handleUserClick(filteredUser)} */>
                                    <Separator />
                                    <div className="w-full flex items-center gap-4 p-3">
                                      <Avatar className="">
                                        <AvatarImage src={filteredUser.profile_picture || "https://github.com/shadcn.png"} />
                                        <AvatarFallback>CN</AvatarFallback>
                                      </Avatar>
                                      <div className="h-full flex flex-col justify-center">
                                        <h1 className="font-semibold">{filteredUser.username}</h1>
                                      </div>
                                    </div>
                                  </div>
                                ))
                            }
                        </div>
                  </div>
              </PopoverContent>
            </Popover>
        </div>
        <div className="h-full px-0 py-0">
          <div className="relative py-2 w-full flex justify-center items-center">
              <Search className="absolute left-6 top-5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search Chats" className="pl-8 mx-4 w-full" /* value={sessionSearchTerm} */
              /* onChange={e => setSessionSearchTerm(e.target.value)} *//>
          </div>
          <div className="overflow-y-scroll scrollbar-custom" style={{ height: `calc(100vh - 265px)` }}>
          {filteredAndSortedSessions.map((session) => {
            // Find the other participant
            const otherParticipant = session.participants.find(participant => participant.id !== user.user_id);

            if (!otherParticipant) return null; // Skip rendering if no other participant

             // Decrypt the last message
            const lastMessage = session.last_message;
             
            return (
                <div className={`relative w-full h-20 flex items-center gap-4 pl-6 pr-3 py-2 hover:bg-muted transition duration-150 ease-in-out rounded-md`} key={session.id} onClick={() => handleUserClick(otherParticipant)}>
                  {lastMessage && !lastMessage.read && lastMessage.sender != "user" && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-primary">
                    {/* This div represents the blue ball */}
                  </div>
                  )}
                  <Popover >
                      <PopoverTrigger onClick={(event) => event.stopPropagation()} className='p-1 absolute top-1 right-2'><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                      <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button onClick={(event) => {event.stopPropagation()}} className='px-4 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>
                        Delete Chat</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your converation for both users.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button variant='destructive' /* onClick={() => deleteChatSession(session.id)} */>Delete</Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      </PopoverContent>
                  </Popover>
                  <Avatar className='h-11 w-11'>
                    <AvatarImage src={otherParticipant.profile_picture || "https://github.com/shadcn.png"} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="h-full flex flex-col justify-center w-full">
                    <h1 className="font-semibold">{otherParticipant.username}</h1>
                    {session.last_message && (
                    <div className="text-sm text-muted-foreground w-full flex justify-between items-center">
                      <div className="flex-1 overflow-hidden">
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{lastMessage.message}</div>
                      </div>
                      <div className="text-xs flex-shrink-0">{compactTimeFormat(session.last_message.timestamp)}</div>
                    </div>
                    )}
                  </div>
                </div>
            );
          })}
          </div>
        </div>
    </Card>
  )
}

export default UserSection