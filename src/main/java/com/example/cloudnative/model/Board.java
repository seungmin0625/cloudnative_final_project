// src/main/java/com/example/board/model/Board.java
package com.example.cloudnative.model;

import jakarta.persistence.*;
import lombok.*;

@Entity// JPA 엔티티로 지정
@Getter @Setter // Lombok으로 Getter, Setter 자동 생성
@NoArgsConstructor // Lombok으로 기본 생성자 자동 생성
@AllArgsConstructor // Lombok으로 모든 필드를 받는 생성자 자동 생성
public class Board {

    @Id // 기본 키
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB가 ID 자동 생성
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String content;

    private String author = "Anonymous"; // 기본값 설정
}