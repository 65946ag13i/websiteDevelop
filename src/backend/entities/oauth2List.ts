import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "@/backend/entities/User";
import { Length, Matches } from "class-validator";
@Entity()
export class oauth2List {
  @PrimaryGeneratedColumn()
  ID?: number;

  @Column({ type: "enum", enum: ["google", "apple"] })
  provider: string = "";

  @Column({ type: "varchar", length: 255 })
  profileId: string = "";

  @Column({ type: "varchar", nullable: false })
  @Length(1, 50)
  @Matches(
    /^[a-zA-Z\u00C0-\u017F\u4e00-\u9fa5\u0600-\u06FF\u0400-\u04FF·\-\s]{1,50}$/,
    {
      message: "非法姓名輸入",
    },
  )
  name: string = "";

  @ManyToOne(() => User, (user) => user.oauth2List, { lazy: true }) //放到user的oauth2list
  user!: Promise<User>; //儲存user的資料 不加promise 會有循環依賴
}
// @ManyToOne(() => User, (user) => user.OAuth2List, {
//   lazy: true, // 使用懶加載模式
// }) //放到user的oauth2list
// user!: User; //儲存user的資料
