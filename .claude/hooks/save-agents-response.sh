#!/bin/bash
input=$(cat)
if echo "$input" | grep -q '"tool_name":"Task"'; then
    agent_output=$(echo "$input" | jq -r '(.tool_response.content // .content)[0].text')
    : > CLAUDE_TEST.md
    echo "$agent_output" >> CLAUDE_TEST.md
fi