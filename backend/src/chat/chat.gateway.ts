import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MailService } from '../mail/mail.service'; // Import MailService
import { UserService } from '../user/user.service'; // Import UserService

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private clients: Map<string, Socket> = new Map();

  constructor(
    private readonly mailService: MailService, // Inject MailService
    private readonly userService: UserService, // Inject UserService
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() message: { sender: string, receiver: string, content: string },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const receiverSocket = this.clients.get(message.receiver);
    if (receiverSocket) {
      receiverSocket.emit('receiveMessage', message);
    } else {
      // Если получатель не в сети, отправляем email
      const receiver = await this.userService.findByFullname(message.receiver);
      if (receiver && receiver.email) {
        await this.mailService.sendNewMessageNotification(receiver.email, message.sender, message.content);
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() username: string, @ConnectedSocket() client: Socket): void {
    client.data.username = username;
    this.clients.set(username, client);
    client.emit('joined', `Welcome ${username}!`);
  }
}