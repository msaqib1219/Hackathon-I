# Railway → Render Migration Specification

**Date:** 2026-04-18  
**Feature:** Migrate backend infrastructure from Railway to Render  
**Status:** Planning  

## Overview
Migrate FastAPI backend + PostgreSQL from Railway (trial ended) to Render free tier while maintaining existing functionality: OAuth2 auth, RAG chatbot, user profiles, and Qdrant vector search.

## Success Criteria
- ✓ FastAPI backend running on Render (free tier)
- ✓ PostgreSQL database on Render (500MB free)
- ✓ Environment variables properly configured
- ✓ OAuth2 + better-auth fully operational
- ✓ Chat API and user profile endpoints working
- ✓ Zero downtime deployment of frontend (stays on Netlify)
- ✓ All credentials rotated post-migration

## In Scope
- Backend deployment configuration for Render
- Database migration from Railway to Render PostgreSQL
- Environment variable setup and secrets management
- Testing endpoints in production
- Documentation of new credentials

## Out of Scope
- Frontend code changes (Netlify deployment unchanged)
- Gemini API setup (already working)
- Qdrant cloud setup (already working)
- Better-auth configuration (already functional)

## Constraints
- Free tier: 500MB DB storage (need to monitor usage)
- Free tier: 100 monthly active hours (sufficient for low traffic)
- Cannot use persistent disk for logs (stateless deployment)

## Current State
- Backend: Railway deployment + Neon PostgreSQL
- Frontend: Netlify (no changes needed)
- Auth: better-auth with JWT tokens
- LLM: Gemini 2.5 Flash
- Vector DB: Qdrant Cloud

## Target State
- Backend: Render deployment (free tier, no credit card needed)
- Database: Supabase PostgreSQL (500MB free, no credit card required)
- Frontend: Netlify (unchanged)
- Auth: better-auth (unchanged)
- All credentials rotated and updated in Netlify env vars
