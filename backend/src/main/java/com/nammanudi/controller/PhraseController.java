package com.nammanudi.controller;

import com.nammanudi.dto.PhraseDto;
import com.nammanudi.service.PhraseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/phrases")
public class PhraseController {

    private final PhraseService phraseService;

    public PhraseController(PhraseService phraseService) {
        this.phraseService = phraseService;
    }

    @GetMapping
    public List<PhraseDto> searchPhrases(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String scenario
    ) {
        return phraseService.searchPhrases(q, scenario);
    }
}
