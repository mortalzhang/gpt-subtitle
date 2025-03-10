// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  userType: "regular" | "oauth";
}

@Entity()
export class RegularUser extends User {
  @Column()
  password: string;
}

@Entity()
export class OAuthUser extends User {
  @Column()
  provider: string;

  @Column()
  providerId: string;
}
