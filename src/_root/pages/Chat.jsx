import React, {useState, useEffect, useRef} from 'react'
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { Search, Send } from "lucide-react"
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faEllipsis, faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import apiClient from '../../services/apiClient';

const Chat = ({sendMessage, messages, setMessages, chatSessions, setChatSessions, fetchUserChatSessions, selectedChat, setSelectedChat, webSocket}) => {

  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionSearchTerm, setSessionSearchTerm] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputLength = input.trim().length;
  let { user } = useContext(AuthContext)

  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //fetch all users
  useEffect(() => {
    apiClient.get(`/users/`)
        .then(response => {
            const filteredUsers = response.data.filter(u => u.id !== user.user_id);
            setUsers(filteredUsers)
        })
        .catch(error => console.error('Error:', error));
    }, []);

  const filteredAndSortedSessions = chatSessions
  .filter(session => {
    const otherParticipant = session.participants.find(participant => participant.id !== user.user_id);
    return otherParticipant ? otherParticipant.username.toLowerCase().includes(sessionSearchTerm.toLowerCase()) : false;
  })
  .sort((a, b) => {
    // Check if last_message exists before trying to access exact_time
    if (!b.last_message || !a.last_message) {
      return 0; // You can decide how to handle sorting when messages are missing, e.g., sort these at the end or start
    }
    return new Date(b.last_message.exact_time) - new Date(a.last_message.exact_time);
  });

  function markMessageAsRead(messageId) {
    const data = {
        read: true
    };
  
    // Return the Axios promise so that you can chain .then() and .catch() outside of this function.
    return apiClient.patch(`messages/${messageId}/`, data);
  }

  const findMatchingSessionId = (sessions, currentUserId, otherUserId) => {
    return sessions.find(session => 
        session.participants.some(participant => participant.id === currentUserId) &&
        session.participants.some(participant => participant.id == otherUserId)
    );
  };

  const handleUserClick = (otherUser) => {
    setSelectedChat(otherUser);
    setIsPopoverOpen(false);
    setSearchTerm('');
    setSessionSearchTerm('');

    let sessionToUpdate; // Defined outside to ensure it's accessible later

    apiClient.get(`/chat/${otherUser.id}/`)
        .then(response => {
              setMessages(prevMessages => ({
                ...prevMessages,
                [otherUser.id]: response.data
            }));
            sessionToUpdate = findMatchingSessionId(chatSessions, user.user_id, otherUser.id);
            if (sessionToUpdate && !sessionToUpdate.last_message.read) {
                return markMessageAsRead(sessionToUpdate.last_message.id);
            }
        })
        .then(() => {
            // Ensure sessionToUpdate is defined before trying to update the state
            if (sessionToUpdate) {
                const updatedSessions = chatSessions.map(session => {
                    if (session.id === sessionToUpdate.id) {
                        const newSession = { ...session, last_message: { ...session.last_message, read: true }};
                        return newSession;
                    }
                    return session;
                });
                setChatSessions(updatedSessions);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setMessages([]);
        });
  };

  const handleBackClick = (otherUser) => {
    console.log(otherUser.id)
    let sessionToUpdate = findMatchingSessionId(chatSessions, user.user_id, otherUser.id);
    console.log(sessionToUpdate)
            if (sessionToUpdate && !sessionToUpdate.last_message.read) {
                markMessageAsRead(sessionToUpdate.last_message.id);
                const updatedSessions = chatSessions.map(session => {
                    if (session.id === sessionToUpdate.id) {
                        const newSession = { ...session, last_message: { ...session.last_message, read: true }};
                        return newSession;
                    }
                    return session;
                });
                setChatSessions(updatedSessions);

            }
    setSelectedChat(null);
    setInput('')
    setMessages([]);
  }

  const handleSendMessage = (input) => {
    sendMessage(input)
    setInput('')
  }

  function compactTimeFormat(timeString) {

    if(timeString) {
    // Handle the "Just now" case directly
    if (timeString === "Just now") {
        return timeString;
    }

    const parts = timeString.split(/\s+/);

    // Handle potential parsing issues
    if (parts.length !== 2) return timeString;

    const number = parseInt(parts[0], 10);
    const unit = parts[1];

    // Return original if parsing fails
    if (isNaN(number)) return timeString;

    // Handling the case for zero minutes specifically
    if (number === 0 && (unit === 'minutes' || unit === 'minute')) {
        return "Just Now";  // Assuming any duration less than a minute should display as "1m"
    }

    switch (unit) {
        case 'minutes':
        case 'minute':
            return number + 'm';
        case 'hours':
        case 'hour':
            return number + 'h';
        case 'days':
        case 'day':
            return number + 'd';
        case 'weeks':
        case 'week':
            return number + 'w';
        case 'years':
        case 'year':
            return number + 'y';
        default:
            return timeString; // Return the original string if unit is unrecognized
    }
  }
}



  return (
      <Card className="border-0 md:border h-full w-full flex overflow-hidden rounded-none md:rounded-xl">
        <Card className={`border-none flex-none rounded-none w-1/3 ${selectedChat ? 'hidden lg:block md:w-1/3' : 'w-full lg:w-1/3'}`}> 
          <div className="flex justify-between items-center p-6 pb-2">
              <h1 className="text-2xl font-semibold">Chats</h1>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger><FontAwesomeIcon size="lg" icon={faPenToSquare} /></PopoverTrigger>
                <PopoverContent>
                  <div className="relative py-2 w-full flex justify-center items-center">
                      <Search className="absolute left-4 top-5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search Users" className="pl-8 w-full mx-2" onChange={e => setSearchTerm(e.target.value)}/>
                  </div>
                  <div className="overflow-y-scroll max-h-[250px] scrollbar-custom">
                    {searchTerm && (
                      <div className="pr-2">
                          {users.filter(user => user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
                              .map(filteredUser => (
                                <div key={filteredUser.id} onClick={() => handleUserClick(filteredUser)}>
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
                      )}
                    </div>
                </PopoverContent>
              </Popover>
          </div>
          <div className="h-full px-0 py-0">
            <div className="relative py-2 w-full flex justify-center items-center">
                <Search className="absolute left-6 top-5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search Chats" className="pl-8 mx-4 w-full" value={sessionSearchTerm}
                onChange={e => setSessionSearchTerm(e.target.value)}/>
            </div>
            <div className="overflow-y-scroll scrollbar-custom" style={{ height: `calc(100vh - 265px)` }}>
            {filteredAndSortedSessions.map((session) => {
              // Find the other participant
              const otherParticipant = session.participants.find(participant => participant.id !== user.user_id);

              if (!otherParticipant) return null; 

              const lastMessage = session.last_message;
              
              return (
                  <div className={`relative w-full h-20 flex items-center gap-4 pl-6 pr-3 py-2 hover:bg-muted transition duration-150 ease-in-out rounded-md`} 
                  key={session.id} onClick={() => handleUserClick(otherParticipant)}>
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
        <Card className={`flex-col flex-grow rounded-none border-0 lg:border-l border-r-0 border-y-0 flex ${!selectedChat ? 'hidden sm:flex' : ''}`}> 
        {selectedChat ? 
          (
          <>
            <CardHeader className="flex flex-row justify-between items-center pt-2 pb-2 pr-0">
                <div className="flex items-center space-x-4">
                    <FontAwesomeIcon onClick={() => handleBackClick(selectedChat)} className='text-primary' size='xl' icon={faChevronLeft} />
                    <Avatar>
                      <AvatarImage src={selectedChat.profile_picture || "https://github.com/shadcn.png"} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{selectedChat.username}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="w-full flex flex-col h-full overflow-y-auto overflow-x-hidden pb-1 px-0">
                <div className="flex flex-col-reverse pb-2 px-2 h-full overflow-y-scroll px-1 scrollbar-custom" /* ref={chatContainerRef} */>
                {selectedChat && messages[selectedChat.id] && (
                messages[selectedChat.id].slice().reverse().map((message, index) => (
                <div
                    key={index}
                    className={cn(
                    "flex w-max max-w-xs flex-col gap-2 rounded-lg px-3 py-2 mt-1 text-sm break-words whitespace-pre-wrap",
                    message.sender === user.user_id
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                >
                    <p>{message.content}</p>
                </div>
                ))
              )}
                
                </div>
            </CardContent>
            <CardFooter className='mt-auto pt-2 px-2 pb-2'>
              <div
                  className="flex w-full items-center space-x-2"
              >
                  <Textarea
                  maxLength={500}
                  id="message"
                  placeholder="Type your message..."
                  className="flex-1 h-10 resize-none"
                  autoComplete="off"
                  value={input}
                  onChange={(event) => setInput(event.target.value)} />
                  <Button onClick={() => handleSendMessage(input, selectedChat)} size="icon" disabled={inputLength === 0}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                  </Button>
              </div>
            </CardFooter>
          </>
          ) 
          :
          (
          <>
            <CardHeader className="flex items-center justify-center w-full h-full">
              <FontAwesomeIcon className="fa-5x" icon={faComments} />
              <h1 className="text-xl font-semibold">Your Messages</h1>
              <p className="text-sm text-muted-foreground">Send messages to a friend</p>
            </CardHeader>
          </>
          )
        }

        </Card>
      </Card>
  )
}

export default Chat