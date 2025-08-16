import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from "typeorm";
import { IsEmail } from "class-validator";
@Entity({ name: "verification_codes", synchronize: false }) //postgres的表名  synchronize=不和資料庫同步結構
export class VerificationCode {
  //導入實體用這個例名
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 6, nullable: false }) // 預設驗證碼長度為 6
  code: string = "";

  @Column({ type: "varchar", length: 255, nullable: false })
  @Index() // 為 email 字段添加索引以加速查詢 不起作用因為synchronize: false
  @IsEmail(
    {},
    {
      message: "信箱不合規",
    }
  )
  email: string = "";
  @CreateDateColumn({
    type: "timestamptz", // 数据类型为 TIMESTAMP WITH TIME ZONE
  })
  created_at!: Date;

  @Column({ type: "timestamptz", nullable: false })
  expires_at!: Date;
}
