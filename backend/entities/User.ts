import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsEmail, Length, Matches } from "class-validator";
import { OAuth2List } from "@/backend/entities/OAuth2List";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "varchar" })
  @Length(3, 100)
  @Matches(/(?!.*[\s<>;'"\\])/, {
    message: "密碼不能包含空白字符、<, >, ;, ', \", 或反斜槓",
  })
  name: string = "";

  @Column({ type: "varchar" })
  @IsEmail()
  @Length(3, 254)
  @Matches(/(?!.*[\s<>;'"\\])/, {
    message: "不能包含空白字符、<, >, ;, ', \", 或反斜槓",
  })
  email: string = "";

  @Column({ type: "varchar" })
  @Length(8, 30)
  @Matches(/(?=.*[0-9])/, { message: "密碼必須包含至少一個數字" })
  @Matches(/(?=.*[a-zA-Z])/, { message: "密碼至少需要包含一個大寫或小寫字母" })
  @Matches(/(?!.*[\s<>;'"\\])/, {
    message: "密碼不能包含空白字符、<, >, ;, ', \", 或反斜槓",
  })
  password: string = "";

  @OneToMany(() => OAuth2List, (oauth2List) => oauth2List.user, {
    cascade: true,
  }) //如何放到oatth2儲存
  OAuth2List?: Promise<OAuth2List[]>; //oauth2 儲存清單
}
