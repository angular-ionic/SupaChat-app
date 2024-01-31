import { Injectable } from '@angular/core';
import {
  RealtimeChannel,
  SupabaseClient,
  createClient,
} from '@supabase/supabase-js';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IMessage {
  created_at: string;
  group_id: number;
  id: number;
  text: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private supabase: SupabaseClient;
  private realTimeChannel: RealtimeChannel;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getGroups() {
    return this.supabase
      .from(GROUPS_DB)
      .select('title,id, users:creator( email )')
      .then((data) => data.data);
  }

  async getGroupById(id: number) {
    return this.supabase
      .from(GROUPS_DB)
      .select('created_at, title, id, users:creator( email, id )')
      .match({ id })
      .single()
      .then((data) => data.data);
  }

  async createGroup(title: string) {
    const newGroup = {
      creator: (await this.supabase.auth.getUser()).data.user?.id,
      title: title,
    };
    return this.supabase.from(GROUPS_DB).insert(newGroup).select().single();
  }

  async addGroupMessage(groupId: number, text: string) {
    const newMessage = {
      text,
      user_id: (await this.supabase.auth.getUser()).data.user?.id,
      group_id: groupId,
    };
    return this.supabase.from(MESSAGES_DB).insert(newMessage);
  }
  async getGroupMessages(groupId: number) {
    return this.supabase
      .from(GROUPS_DB)
      .select('created_at, text, id, users:user_id ( email, id )')
      .match({ group_id: groupId })
      .limit(25)
      .then((data) => data.data);
  }

  listenToGroup() {
    const subject = new Subject();

    this.realTimeChannel = this.supabase.channel('public:messages').on(
      'broadcast',
      {
        event: '*',
      },
      (payload) => {
        console.log(payload);
        subject.next(payload);
      }
    );

    return subject.asObservable();
  }

  unSubscribeGroupChanges() {
    if (this.realTimeChannel) {
      this.supabase.removeChannel(this.realTimeChannel);
    }
  }
}

const GROUPS_DB = 'groups';
const MESSAGES_DB = 'messages';
