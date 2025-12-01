// src/main/java/com/example/board/repository/BoardRepository.java
package com.example.cloudnative.repository;

import com.example.cloudnative.model.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// JpaRepository를 상속받아 기본적인 CRUD 기능을 자동으로 상속받습니다.
public interface BoardRepository extends JpaRepository<Board, Long> {
}