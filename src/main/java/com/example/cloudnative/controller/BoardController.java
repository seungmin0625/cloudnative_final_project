// src/main/java/com/example/board/controller/BoardController.java
package com.example.cloudnative.controller;

import com.example.cloudnative.model.Board;
import com.example.cloudnative.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // RESTful API 컨트롤러로 지정
@RequestMapping("/api/boards") // 기본 URL 경로 설정
public class BoardController {

    @Autowired
    private BoardRepository boardRepository;

    // 1. 게시글 전체 조회 (Read All)
    @GetMapping
    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    // 2. 게시글 생성 (Create)
    @PostMapping
    public Board createBoard(@RequestBody Board board) {
        return boardRepository.save(board);
    }

    // 3. 특정 게시글 조회 (Read One)
    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardById(@PathVariable Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다: " + id));
        return ResponseEntity.ok(board);
    }

    // 4. 게시글 수정 (Update)
    @PutMapping("/{id}")
    public ResponseEntity<Board> updateBoard(@PathVariable Long id, @RequestBody Board boardDetails) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다: " + id));

        board.setTitle(boardDetails.getTitle());
        board.setContent(boardDetails.getContent());

        // author 필드는 이 예시에서는 수정하지 않음

        final Board updatedBoard = boardRepository.save(board);
        return ResponseEntity.ok(updatedBoard);
    }

    // 5. 게시글 삭제 (Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다: " + id));

        boardRepository.delete(board);
        return ResponseEntity.noContent().build();
    }
}