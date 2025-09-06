import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import { User } from "@/backend/entities/User";
// import type { User as userID } from "@/backend/entities/User";
@Entity()
export class userQuote {
  @PrimaryGeneratedColumn()
  id!: number;
  //+  !是告訴orm一定有數值

  @Column("uuid") //+ 儲存一般字串
  @IsUUID("4", { message: "必須是 UUID version 4 格式" })
  @IsNotEmpty()
  UUID: string = "";

  @Column("text", { array: true }) // 儲存 string[]
  @IsArray() //+ 確保是數組
  @IsString({ each: true }) //+ 確保數組中每個元素都是字符串
  @IsIn(["國際牌", "日立", "華菱"], { each: true })
  @ArrayNotEmpty()
  conditionerSelectedOption: string[] = [];

  @Column("text")
  @MaxLength(60)
  @IsString()
  brands: string = "";

  @Column("text")
  @MaxLength(300)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  remarks: string = "";

  @Column({
    type: "enum",
    enum: ["Fulfilled", "Unfulfilled"],
    default: "Unfulfilled",
  })
  @IsIn(["Fulfilled", "Unfulfilled"])
  state: string = "Unfulfilled";

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  userid!: number;

  @ManyToOne(() => User, (user) => user.userQuote) //+  放到user的userQuote
  @JoinColumn({ name: "userid" })
  user!: Promise<User>;
}
