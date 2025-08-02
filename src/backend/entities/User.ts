import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from "typeorm";
import { IsEmail, Length, Matches } from "class-validator";
import { oauth2List } from "@/backend/entities/oauth2List";
import { userQuote } from "@/backend/entities/userQuote";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  //.  !是告訴一定有數值
  @Column({ type: "varchar", nullable: false })
  @Length(1, 50)
  @Matches(
    /^[a-zA-Z\u00C0-\u017F\u4e00-\u9fa5\u0600-\u06FF\u0400-\u04FF·\-\s]{1,50}$/,
    {
      message: "非法姓名輸入",
    }
  )
  name: string = "";

  @Column({ type: "varchar", nullable: false, unique: true })
  @Index()
  @IsEmail()
  @Length(1, 50)
  @Matches(/(?!.*[\s<>;'"\\])/, {
    message: "不能包含空白字符、<, >, ;, ', \", 或反斜槓",
  })
  email: string = "";

  @Column({ type: "varchar", nullable: true })
  @Length(8, 65)
  @Matches(/^(?=.{8,30}$)(?=.*[a-zA-Z])(?=.*\d)(?!.*[^ -~])(?!.*[<>&'"]).*$/, {
    message: "密碼不合規",
  })
  password: string = "";

  @OneToMany(() => oauth2List, (oauth2List) => oauth2List.user, {
    cascade: true,
  }) //如何放到oatth2儲存
  oauth2List?: oauth2List[]; //oauth2 儲存清單

  @OneToMany(() => userQuote, (userQuote) => userQuote.user) //如何放到oatth2儲存
  userQuote?: userQuote[]; //oauth2 儲存清單
}
