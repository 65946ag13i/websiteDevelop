import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "@/backend/entities/User";

@Entity()
export class OAuth2List {
  @PrimaryGeneratedColumn()
  ID?: number;

  @Column({ type: "enum", enum: ["google", "apple"] })
  provider: string = "";

  @Column({ type: "varchar" })
  profileId: string = "";

  @ManyToOne(() => User, (user) => user.OAuth2List) //放到user的oauth2list
  user!: Promise<User>; //儲存user的資料 不加promise 會有循環依賴
}
// @ManyToOne(() => User, (user) => user.OAuth2List, {
//   lazy: true, // 使用懶加載模式
// }) //放到user的oauth2list
// user!: User; //儲存user的資料
