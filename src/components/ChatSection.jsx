import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ChatSection = () => {

    const [user, setUser] = useState({ user_id: 1 }); // Assume the current user has an ID of 1
    const [messages, setMessages] = useState({
      1: [
        { sender: 1, content: "Hey, how's it going?" },
        { sender: 2, content: "Not bad, how about you?" },
        { sender: 1, content: "I'm good, just working on a project." },
        { sender: 2, content: "Nice! What project are you working on?" },
        { sender: 1, content: "Building a chat app with React!" },
      ],
      2: [
        { sender: 1, content: "Hello!" },
        { sender: 3, content: "Hi, who is this?" },
        { sender: 1, content: "Just a friendly bot :)" },
      ],
    });
  
    const [selectedChat, setSelectedChat] = useState({ id: 1 }); // Assume chat with ID 1 is selected
  

  return (
    <Card className={`flex-col flex-grow rounded-none border-0 lg:border-l border-r-0 border-y-0 flex ${!selectedChat ? 'hidden sm:flex' : ''}`}> 
        {selectedChat ? 
          (
          <>
            <CardHeader className="flex flex-row justify-between items-center pt-2 pb-2 pr-0">
                <div className="flex items-center space-x-4">
                    <FontAwesomeIcon /* onClick={() => handleBackClick(selectedChat)} */ className='text-primary' size='xl' icon={faChevronLeft} />
                    <Avatar>
                      <AvatarImage /* src={selectedChat.profile_picture || "https://github.com/shadcn.png"} */ />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{/* {selectedChat.username} */}John</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                {/* {!selectedChat.trainers.includes(user.user_id) && (
                  <div className="flex items-center md:gap-2 mr-2 md:mr-4">
                    <div className="h-12 w-12 hover:bg-secondary rounded-full flex items-center justify-center">
                    <AlertDialog>
                        <AlertDialogTrigger>
                          <div className="h-12 w-12 lg:hover:bg-secondary rounded-full flex items-center justify-center">
                            <FontAwesomeIcon size='lg' className="text-primary ml-1" icon={faUserPlus} />
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Would you like to send {selectedChat.username} a Trainer request?</AlertDialogTitle>
                            <AlertDialogDescription>
                              As a Trainer you will gain access to {selectedChat.username}'s workout calendar and progress charts
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={sendTrainerRequest}>Send Request</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    {selectedChat.clients.includes(user.user_id) ? (
                    <Popover open={isClientPopoverOpen} onOpenChange={setIsClientPopoverOpen}>
                    <PopoverTrigger>
                    <div className="h-12 w-12 hover:bg-secondary rounded-full flex items-center justify-center">
                      <FontAwesomeIcon className='text-primary' size='lg' icon={faEllipsis} />
                    </div>
                    </PopoverTrigger>
                    <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                      <Button className='px-4 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>
                      Remove Trainer</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {`This will remove ${selectedChat.username} as your Trainer.`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setIsClientPopoverOpen(false)}>Cancel</AlertDialogCancel>
                          <Button variant='destructive' onClick={handleRemoveTrainer}>Remove</Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    </PopoverContent>
                  </Popover>) : (
                    <div className="h-12 w-1"></div>
                    )}
                </div>
                )} */}
                  {/* {selectedChat.trainers.includes(user.user_id) && (
                  <div className="flex items-center md:gap-2 md:mr-4 mr-2">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                      <SheetTrigger asChild>
                          <div className="h-12 w-12 hover:bg-secondary rounded-full flex items-center justify-center">
                            <FontAwesomeIcon onClick={() => setIsSheetOpen(true)} size='lg'className="text-primary" icon={faArrowUpFromBracket} />
                          </div>
                      </SheetTrigger>
                      <SheetContent className="md:w-[400px] w-[100%]">
                          <SheetHeader className='text-left pl-4 flex flex-row justify-between items-center mt-4'>
                              <SheetTitle className='text-2xl' >Share Programs</SheetTitle>
                          </SheetHeader>
                          <div className='flex flex-col gap-2 mt-2 overflow-y-auto max-h-[75vh] scrollbar-custom'>
                          {userPrograms.map((program) => (
                          <div
                              key={program.id}
                              className={`flex items-center p-4 py-3 relative rounded border`}
                              
                          >
                              <h1 className='w-[90%] '>{program.name}</h1>
                              <AlertDialog>
                                <AlertDialogTrigger>
                                <div className="h-12 w-12 hover:bg-secondary rounded-full flex items-center justify-center">
                                  <FontAwesomeIcon onClick={() => setIsSheetOpen(true)} size='lg'className="text-primary" icon={faArrowUpFromBracket} />
                                </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Would you like to share "{program.name}"?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Programs shared will be available to participants under their shared programs section.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleShareClick(program)}>Share</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                          </div>
                          ))}
                          </div>
                      </SheetContent>
                    </Sheet>
                    <div onClick={handleClientProgressClick} className="h-12 w-12 hover:bg-secondary rounded-full flex items-center justify-center">
                      <FontAwesomeIcon className='text-primary' size='lg' icon={faChartLine} />
                    </div>
                    <Popover open={isClientPopoverOpen} onOpenChange={setIsClientPopoverOpen}>
                      <PopoverTrigger>
                      <div className="h-12 w-12 hover:bg-secondary rounded-full flex items-center justify-center">
                        <FontAwesomeIcon className='text-primary' size='lg' icon={faEllipsis} />
                      </div>
                      </PopoverTrigger>
                      <PopoverContent className='w-full flex flex-col overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button className='px-4 py-1.5 text-sm outline-none rounded-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>
                        Remove Client</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {`This will remove ${selectedChat.username} as your client.`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsClientPopoverOpen(false)}>Cancel</AlertDialogCancel>
                            <Button variant='destructive' onClick={handleRemoveClient}>Remove</Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      {selectedChat.clients.includes(user.user_id) &&
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                          <Button className='px-4 py-1.5 text-sm rounded-none outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>
                          Remove Trainer</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {`This will remove ${selectedChat.username} as your Trainer.`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setIsClientPopoverOpen(false)}>Cancel</AlertDialogCancel>
                              <Button variant='destructive' onClick={handleRemoveTrainer}>Remove</Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>}
                      </PopoverContent>
                  </Popover>
                    
                  </div>
                  )} */}
                </div>
                
            </CardHeader>
            {/* {matchingRequest && (
                  <div className="bg-background border-y flex justify-between items-center p-2">
                    <p className='text-sm font-medium'>{selectedChat.username} has sent you a trainer request.</p>
                    <div className="flex items-center gap-1">
                      <Button size='sm' onClick={() => handleRequest(matchingRequest.id, 'accept')}>Accept</Button>
                      <Button size='sm' variant='outline' onClick={() => handleRequest(matchingRequest.id, 'reject')}>Reject</Button>
                    </div>
                  </div>
                )} */}
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
                  /* value={input} */
                  /* onChange={(event) => setInput(event.target.value)} */ />
                  <Button /* onClick={() => handleSendMessage(input, selectedChat)} */ size="icon" /* disabled={inputLength === 0} */>
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
  )
}

export default ChatSection