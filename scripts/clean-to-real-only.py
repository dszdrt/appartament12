import psycopg2

db_url = "postgresql://neondb_owner:npg_ZMUOCu1LbT9I@ep-wild-mud-aygvpag6-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"

def main():
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cur = conn.cursor()
    
    print("Clearing seeded reviews from DB...")
    cur.execute('DELETE FROM "Review";')
    print("Reviews table cleared! Now only real reviews added by admin via CMS or live integrations will appear.")

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
