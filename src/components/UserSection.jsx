import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Popover, PopoverContent,PopoverTrigger,} from "@/components/ui/popover"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare} from "@fortawesome/free-solid-svg-icons";

const UserSection = () => {
  return (
    <Card className={`border-none flex-none rounded-none w-1/3`}> {/* ${selectedChat ? 'hidden lg:block md:w-1/3' : 'w-full lg:w-1/3'} */}
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
                {/* {searchTerm && (
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
                    )} */}
                  </div>
              </PopoverContent>
            </Popover>
        </div>
    </Card>
  )
}

export default UserSection