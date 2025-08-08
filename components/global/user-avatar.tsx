import { cn } from '@/lib/utils';
import { generateAvatarFallback } from '@/utils/generate-avatar-fallback';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type Props = {
  username: string | null,
  userimage: string | null,
  className?: string,
  textSize?: string,
  bgColor?: string
};

export function UserAvatar({
  username,
  userimage,
  className,
  textSize,
  bgColor
}: Props) {
  return(
    <Avatar className={cn(className ? className : 'h-8 w-8 rounded-lg' )}>
      <AvatarFallback
        className={cn(
          'font-semibold bg-primary text-primary-foreground bg-gradient-to-br from-emerald-300 via-emerald-800 to-emerald-900',
          bgColor,
          textSize
        )}
      >
        <span className={textSize}>
          {generateAvatarFallback(username)}
        </span>
      </AvatarFallback>
      <AvatarImage 
        src={userimage || ''}
        className='object-cover'
      />
    </Avatar>
  );
};